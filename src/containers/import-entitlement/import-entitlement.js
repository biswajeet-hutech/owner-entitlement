import React from "react";

import { message, Input, Alert, Spin, Row } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

import Button from "../../components/button";
import API, { localMode } from "../../api";
import dummyResponse from "../../data/import-entitlement.json";
import "./style.scss";
import { ExportCertIcon } from "../../assets";
import { exportCSVData } from "../../utils/multiple-csv";

class ImportEntitlements extends React.Component {
  state = {
    selectedRowKeys: [],
    loading: false,
    dataList: [],
    importDataList: {},
    selectedFileName: '',
    uploadingFile: false,
    uploadComplete: false
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  importCallback = (file) => {
    if (file) {
      let fileName = "";
      fileName = file[0].name;
      const uploadError = fileName.split('.')[1] !== 'csv' ? 'Only csv files are allowed to upload.' : '';
      const stateData = {
        selectedFileName: file[0].name,
        inputError: uploadError,
        uploadComplete: false,
        selectedFile: !uploadError ? file[0] : ''
      }
      this.setState({
        ...stateData
      });
    }
  };

  handleImport = () => {
    const { inputError, selectedFile } = this.state;
    if (!inputError) {
      this.importAPI(selectedFile);
    }
  }

  importAPI = (file) => {
    if (file) {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      const formData = new FormData();
      formData.append("file", file);
      this.setState({
        uploadingFile: true
      })
      API.post(`EntitlementManagement/import`, formData, config)
        .then((response) => {
          this.setState({
            importDataList: response.data || {},
            uploadingFile: false,
            uploadComplete: true
          });
          this.props.onSuccess();
        })
        .catch((error) => {
          // error
          // console.log(error);
          if (localMode) {
            this.setState({
              importDataList: dummyResponse || {},
              uploadingFile: false,
              uploadComplete: true
            });
            this.props.onSuccess();
          } else {
            this.setState({
              uploadingFile: false,
              uploadComplete: true,
              importDataList: {},
              inputError: 'Unable to import file. Please try again!'
            })
          }
        })
        .then(() => {
          // always executed
        });
    }
  };

  onChangeUploadHandler = (info) => {
    if (info.file.status !== "uploading") {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  handleClose = () => {
    this.setState({
      inputError: '',
      uploadComplete: false
    })
  }

  exportResult = () => {
    const { importDataList } = this.state;
    exportCSVData(
      importDataList?.csvResult?.headers || [],
      importDataList?.csvResult?.csvData || [],
      "Import_Entitlement_Update_Result.csv"
    );
  }

  render() {
    const { importDataList } = this.state;
    const hasMultipleEntitlements = importDataList.totalEntitlements > 1;
    const renderUploadForm = (
      <>
      <div className="upload-container">
        <div className="section-upload">
          <input type="file" className="file-input" value="" onChange={(e) => this.importCallback(e.target.files)} disabled={this.state.uploadingFile} />
          <Input
            placeholder="Only .csv file are allowed to upload"
            className="input-upload"
            value={this.state.selectedFileName}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <Button className="upload-btn batch-access-btn" disabled={this.state.uploadingFile}>Browse File</Button>
        </div>
        <div className="error-container">
          {
            this.state.inputError && <Alert message={this.state.inputError} type="error" showIcon closable onClose={this.handleClose} />}
        </div>
      </div>
      <Row justify="end" className="accordion_footer">
        <Button type="secondary" size="large" className="cancel" onClick={this.props.onCancel}>Cancel</Button>
        <Button type="primary" size="large" className="save" onClick={this.handleImport} disabled={!this.state.selectedFile}>Upload</Button>
      </Row>
    </>
    );

    const renderUploadingState = (
      <div style={{ textAlign: 'center' }}>
        <LoadingOutlined style={{ fontSize: 24 }} spin />
        <p style={{ marginTop: 20 }}>Please wait while importing Entitlements</p>
      </div>
    )

    const renderImportSuccess = (
      <div className="oe-ie-success-container">
        <h5>{`${importDataList.totalEntitlements} Entitlement${hasMultipleEntitlements ? 's' : ''} uploaded!`}</h5>
        <ul>
          <li>{importDataList.updatedEntitlements} Successfully updated</li>
          <li>{importDataList.failedEntitlements} Update failed</li>
          <li>{importDataList.notfoundEntitlements} Not found</li>
          <li>{importDataList.unatourizedEntitlements} Unauthorized update</li>
        </ul>
        {/* <p>Status: <strong style={{ textTransform: 'capitalize', color: '#509e14' }}>{importDataList.message}</strong></p> */}
        <Button onClick={this.exportResult}>
          <ExportCertIcon />
          <span style={{ marginLeft: 5 }}>Export Result</span>
        </Button>
      </div>
    );

    const renderImportError = (
      <Alert
        message="Error"
        description={`${importDataList?.message || 'Unable to import data'}, Please try again.`}
        type="error"
      />
    );
    return (
      <Spin spinning={this.state.loading}>
        <div className="import-access-review-root">
          <div className="section table-wrapper table-action-wrapper">
            {
              this.state.uploadingFile ? renderUploadingState : (this.state.uploadComplete ? (importDataList.message === "success" ? renderImportSuccess : renderImportError) : renderUploadForm)
            }
          </div>
        </div>
      </Spin>
    );
  }
}

export default ImportEntitlements;
