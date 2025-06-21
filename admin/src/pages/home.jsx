import { Card, Col, Row, Statistic, Typography, List, Avatar, Tag } from "antd";
import {
  EnvironmentOutlined,
  DeploymentUnitOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { Route, Train } from "lucide-react";
import MapComponent from "../components/map";

const { Title } = Typography;

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTrains: 0,
    onRoute: 0,
    arrived: 0,
    totalStations: 0,
    activeStations: 0,
    totalWagons: 0,
    workingWagons: 0,
    totalRoutes: 0,
    recentTrains: [],
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/route/stats`)
      .then((res) => setStats(res.data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Jami vagonlar"
              value={stats.totalWagons}
              prefix={<InboxOutlined />}
              suffix="ta"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ishlayotgan vagonlar"
              value={stats.workingWagons}
              suffix="ta"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Jami stansiyalar"
              value={stats.totalStations}
              prefix={<EnvironmentOutlined />}
              suffix="ta"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Faol stansiyalar"
              value={stats.activeStations}
              suffix="ta"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Harakat tarkiblari soni"
              value={stats.totalTrains}
              prefix={<Train />}
              suffix="ta"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Yo‘lda"
              prefix={<Route />}
              value={stats.onRoute}
              suffix="ta"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Yetib kelgan"
              prefix={<Route />}
              value={stats.arrived}
              suffix="ta"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Yo‘nalishlar soni"
              value={stats.totalRoutes}
              prefix={<DeploymentUnitOutlined />}
              suffix="ta"
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 40 }}>
        <Col span={24}>
          <Card title="So‘nggi poyezdlar harakati">
            <List
              itemLayout="horizontal"
              dataSource={stats.recentTrains}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<Train />} />}
                    title={item.name}
                    description={`Stansiya: ${
                      item.currentStationName || "Noma'lum"
                    } | Jo'nash: ${
                      item.departureTime
                        ? new Date(item.departureTime).toLocaleString()
                        : "yo'q"
                    }`}
                  />
                  <Tag
                    color={
                      item.status === "yo‘lda"
                        ? "blue"
                        : item.status === "yetib keldi"
                        ? "green"
                        : "default"
                    }
                  >
                    {item.status}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 40 }}>
        <Col span={24}>
          <Card title="Stansiyalar xaritada">
            <MapComponent />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
