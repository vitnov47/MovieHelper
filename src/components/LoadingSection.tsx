import { Skeleton, Col, Row } from "antd";
import "../styles/card.css";

const LoadingSection = () => {
  return (
    <Row gutter={[16, 24]}>
      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
        <div className="film-card">
          <div className="poster-wrapper">
            <Skeleton.Image className="skeleton-poster" />
          </div>
          <Skeleton active paragraph={{ rows: 1 }} />
        </div>
      </Col>{" "}
      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
        <div className="film-card">
          <div className="poster-wrapper">
            <Skeleton.Image className="skeleton-poster" />
          </div>
          <Skeleton active paragraph={{ rows: 1 }} />
        </div>
      </Col>{" "}
      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
        <div className="film-card">
          <div className="poster-wrapper">
            <Skeleton.Image className="skeleton-poster" />
          </div>
          <Skeleton active paragraph={{ rows: 1 }} />
        </div>
      </Col>{" "}
      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
        <div className="film-card">
          <div className="poster-wrapper">
            <Skeleton.Image className="skeleton-poster" />
          </div>
          <Skeleton active paragraph={{ rows: 1 }} />
        </div>
      </Col>{" "}
      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
        <div className="film-card">
          <div className="poster-wrapper">
            <Skeleton.Image className="skeleton-poster" />
          </div>
          <Skeleton active paragraph={{ rows: 1 }} />
        </div>
      </Col>{" "}
      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
        <div className="film-card">
          <div className="poster-wrapper">
            <Skeleton.Image className="skeleton-poster" />
          </div>
          <Skeleton active paragraph={{ rows: 1 }} />
        </div>
      </Col>
    </Row>
  );
};

export default LoadingSection;
