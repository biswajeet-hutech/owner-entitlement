
import React from "react";
import { AutoComplete, Spin, Select } from "antd";
import debounce from 'lodash/debounce';

const SuggestiveInput = ({
  fetchOptions,
  debounceTimeout = 1000,
  renderWorkgroupWithUsers,
  defaultSearchValue,
  value,
  readOnly,
  onChange,
  maxLength,
  ...otherProps
}) => {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const fetchRef = React.useRef(0);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, []);

  const showCount = (
    <div style={{ textAlign: 'right' }}>
      {`${value?.length || 0} / ${maxLength}`}
    </div>
  )

  return (
    <>
      {
        readOnly ? <span>{ value?value:'' }</span> : (
          <>
            <AutoComplete
              style={{ width: '100%' }}
              options={options}
              value={value}
              onSearch={debounceFetcher}
              onChange={onChange}
              placeholder={otherProps.placeholder || ""}
              className={`oe-form-autocomplete ${otherProps.error && 'oe-form-error'}`}
              filterOption={(inputValue, option) => option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
            <div className="flex-space form-footer-container">
              { otherProps.error ? <div className="oe-form-error-text">{otherProps.error}</div> : <div /> }
              { maxLength && showCount }
            </div>
          </>
        )
      }
    </>
  )
}

export default SuggestiveInput;
