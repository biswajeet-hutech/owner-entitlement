import React, { useCallback } from "react";
import { Checkbox, Row, Table, Collapse } from "antd";
import TextArea from "antd/lib/input/TextArea";

import { messages } from "../../assets";
import Button from "../../components/button";
import API, { localMode } from "../../api";
import FormElement from "../../components/form-element";
const { Panel } = Collapse;
const ReviewTable = ({data = []}) => {
  const columns = [
    {
      title: "Date & Time",
      dataIndex: "reviewdate",
      key: "reviewdate"
    },
    {
      title: "ReviewComment",
      dataIndex: "comment",
      key: "comment"
    },
    {
      title: "Reviewer",
      dataIndex: "reviewername",
      key: "reviewername"
    },
  ];

  return (
    <Table className="oe-review-table" dataSource={data} columns={columns} pagination={false} />
  );
}

const SelfReview = ({
  isEntitlementReviewed,
  entitlementid,
  updateReviewState = () => {}
}) => {
  const [reviewState, setReviewState] = React.useState(isEntitlementReviewed);
  const [feedback, setFeedback] = React.useState('');
  const [reviewHistory, setReviewHistory] = React.useState([]);
  const handleSubmitReviewFeedback = useCallback(() => {
    if (entitlementid && feedback) {
      updateReviewState({
        entitlementid: entitlementid,
        comment: feedback,
        status: 'success'
      })
    }
  }, [feedback]);

  const getEntitlementReviewHistory = () => {
    API.get(`/EntitlementManagement/review/history/${entitlementid}`).then(response => {
      try {
        if (response.data.ReviewHistory) {
          setReviewHistory(response.data.ReviewHistory);
        }
      } catch(error) {
        console.log(error);
      }
    }).catch(e => {
      if (localMode) {
        import("../../data/review-history.json").then(res => {
          setReviewHistory(res.ReviewHistory);
        });
      }
    })
  }

  React.useEffect(() => {
    if (isEntitlementReviewed) {
      getEntitlementReviewHistory();
    }
    setReviewState(!!isEntitlementReviewed);
  }, [isEntitlementReviewed]);

  return (
    <>
    <div className="form-section form-top-border">
      <Row justify="start">
        <Checkbox
          checked={reviewState}
          onChange={((e) => setReviewState(e.target.checked))}
          className="oe-review-checkbox"
          disabled={isEntitlementReviewed}
        >
          I confirm the entitlement details are appropriate
        </Checkbox>
      </Row>
      { reviewState && !isEntitlementReviewed && (
        <div style={{ marginTop: 20, width: '70%' }} >
          <p style={{ fontSize: 13, fontWeight: 600 }}>Type your Feedback *</p>
          <TextArea
            showCount={true}
            maxLength={250}
            value={feedback}
            rows={4}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Row justify="end" style={{ marginTop: 16 }}>
            <Button type="secondary" size="large" className="cancel" onClick={() => {setReviewState(false); setFeedback('')}}>{messages.CANCEL_BTN}</Button>
            <Button type="primary" size="large" className="save" onClick={handleSubmitReviewFeedback} disabled={!feedback}>{messages.SUBMIT}</Button>
          </Row>
        </div>
      )}
    </div>
    <div className="form-section form-top-border">
      <Collapse
        expandIconPosition={'right'}
        className="oe-review-accordion"
      >
        <Panel header="Review History" key="1">
          <ReviewTable data={reviewHistory} />
        </Panel>
      </Collapse>
    </div>
    </>
  )
}

export default React.memo(SelfReview);