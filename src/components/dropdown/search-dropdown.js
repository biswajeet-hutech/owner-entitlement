import React from "react";
import { Select, Spin, Tag } from 'antd';
import { CaretDownFilled } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import "./style.scss";

const { Option, OptGroup } = Select;

function DebounceSelect({ 
  fetchOptions,
  debounceTimeout = 800,
  renderWorkgroupWithUsers,
  defaultSearchValue,
  overrideClass,
  dataObject,
  ...props
}) {
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
  }, [fetchOptions, debounceTimeout]);

  React.useEffect(() => {
    debounceFetcher('');
  }, []);

  React.useEffect(() => {
    if (dataObject) {
      debounceFetcher('', 0);
    }
  }, [dataObject]);

  const renderOptions = () => {
    const workgroupOptionList = options.filter(item => item.workgroup);
    const nonWorkgroupOptionList = options.filter(item => !item.workgroup);
    return (
    <>
      <OptGroup label="Workgroup">
        {
          workgroupOptionList.map(option => (
            <Option value={option.value} label={option.label} keyId={option.value} workgroup={true}>{option.label}</Option>
          ))
        }
      </OptGroup>
      <OptGroup label="Members">
      {
        nonWorkgroupOptionList.map(option => (
          <Option value={option.value} label={option.label} keyId={option.value} workgroup={false}>{option.label}</Option>
        ))
      }
      </OptGroup>
    </>
  );
  }

  const handleChange = (value, data=[]) => {
    if (typeof props.onChange === "function") {
      props.onChange(value, Array.isArray(data) && data.map(item => ({
        workgroup: item.workgroup,
        id: item.value,
        value: item.value,
        label: item.label
      })));
    }

    if (!value || (Array.isArray(value) && !value.length)) {
      debounceFetcher('', 500);
    }
    return;
  }

  return (
    <div className={`oe-dropdown-container ${overrideClass}`}>
      <Select
        // labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        onChange={(value,  workgroupObj) => handleChange(value, workgroupObj)}
        loading={fetching}
        className="oe-dropdown"
        suffixIcon={<CaretDownFilled
          style={{ fontSize: 16 }} />}
      >
        {
          fetching ? <Option><div style={{ display: 'flex', justifyContent: 'center' }}><Spin size="small" /></div></Option> : 
          (renderWorkgroupWithUsers ? renderOptions(options) : options.map(option => (
            <Option value={option.value} label={option.label} keyId={option.value} workgroup={false}>
              {
                option.bold ? <b>{option.label}</b> : option.label
              }
            </Option>
          ))
          )
        }
      </Select>
    </div>
  );
} // Usage of DebounceSelect

export default DebounceSelect;
