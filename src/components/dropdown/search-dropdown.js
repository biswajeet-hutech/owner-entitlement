import React from "react";
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const { Option, OptGroup } = Select;

function DebounceSelect({ fetchOptions, debounceTimeout = 800, renderWorkgroupWithUsers, ...props }) {
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
    debounceFetcher();
  }, []);

  const renderOptions = () => {
    const workgroupOptionList = options.filter(item => item.workgroup);
    const nonWorkgroupOptionList = options.filter(item => !item.workgroup);
    console.log(workgroupOptionList, nonWorkgroupOptionList);
    return (
    <>
      <OptGroup label="Workgroup">
        {
          workgroupOptionList.map(option => (
            <Option value={option.id} label={option.label} keyId={option.value}>{option.label}</Option>
          ))
        }
      </OptGroup>
      <OptGroup label="Members">
      {
        nonWorkgroupOptionList.map(option => (
          <Option value={option.id} label={option.label} keyId={option.value}>{option.label}</Option>
        ))
      }
      </OptGroup>
    </>
  );
  }

  return (
    <Select
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      // options={options}
      onChange={(value) => props.onChange(value)}
      loading={fetching}
    >
      {
        fetching ? <Spin size="small" /> : 
        (renderWorkgroupWithUsers ? renderOptions(options) : options.map(option => (
          <Option value={option.value} label={option.label} keyId={option.value}>
            {
              option.bold ? <b>{option.label}</b> : option.label
            }
          </Option>
        ))
        )
      }
    </Select>
  );
} // Usage of DebounceSelect

export default DebounceSelect;
