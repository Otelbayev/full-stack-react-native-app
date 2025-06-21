import { useState, useEffect } from "react";
import {
  Card,
  Input,
  Spin,
  Descriptions,
  Button,
  Row,
  Col,
  Image,
  Flex,
} from "antd";
import axios from "axios";
import no from "../assets/no.png";
import StationMap from "../components/single-map";

export default function Search() {
  const [query, setQuery] = useState("");
  const [vagonData, setVagonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:1604/api/vagon/search/${query}`
      );
      if (res.status === 200) {
        setVagonData(res.data);
        setLoading(false);
      } else {
        setLoading(false);
        setError(res?.data?.message || "Xatolik yuz berdi");
      }
    } catch (e) {
      setLoading(false);
      setError(e?.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  console.log(vagonData);
  return (
    <Card title="Vagon qidirish" style={{ margin: "0 auto" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={20}>
          <Input
            placeholder="Vagon raqamini kiriting (masalan: 2349857)"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </Col>
        <Col xs={24} md={4}>
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={getData}
            loading={loading}
            icon={loading ? <Spin /> : null}
          >
            Qidirish
          </Button>
        </Col>
      </Row>

      {loading && (
        <div style={{ marginTop: 20 }}>
          <Spin tip="Yuklanmoqda..." />
        </div>
      )}

      {vagonData && !loading && !error ? (
        <>
          <Descriptions
            title="Vagon Ma'lumotlari"
            bordered
            column={1}
            style={{ marginTop: 20 }}
            size="small"
          >
            <Descriptions.Item label="Vagon raqami">
              {vagonData?.vagon?.number}
            </Descriptions.Item>
            <Descriptions.Item label="Turi">
              {vagonData?.vagon?.type}
            </Descriptions.Item>
            <Descriptions.Item label="Tonnasi">
              {vagonData?.vagon?.capacityTons} tonna
            </Descriptions.Item>
            <Descriptions.Item label="Hajmi">
              {vagonData?.vagon?.volumeM3} m³
            </Descriptions.Item>
            <Descriptions.Item label="O'qlari soni">
              {vagonData?.vagon?.axles}
            </Descriptions.Item>
            <Descriptions.Item label="Yaratilgan yili">
              {vagonData?.vagon?.yearBuilt}
            </Descriptions.Item>
            <Descriptions.Item label="Egalik qiluvchi">
              {vagonData?.vagon?.owner}
            </Descriptions.Item>
            <Descriptions.Item label="Oxirgi tex ko'rik">
              {new Date(vagonData?.vagon?.lastInspection).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Holati">
              {vagonData?.vagon?.isOperational ? "Ishlayapti" : "Nosoz"}
            </Descriptions.Item>

            <Descriptions.Item label="Harakat tarkibi nomi">
              {vagonData?.train?.name || "Biriktirilmagan"}
            </Descriptions.Item>
            <Descriptions.Item label="Harakat tarkibi holati">
              {vagonData?.train?.status}
            </Descriptions.Item>
            <Descriptions.Item label="Jo'nash vaqti">
              {new Date(vagonData?.train?.departureTime).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Yetib borish vaqti">
              {new Date(vagonData?.train?.arrivalTime).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Marshrut">
              {vagonData?.train?.route?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Umumiy masofa">
              {vagonData?.train?.route?.distance} km
            </Descriptions.Item>
            <Descriptions.Item label="Taxminiy vaqt">
              {vagonData?.train?.route?.estimatedTime} daqiqa
            </Descriptions.Item>
          </Descriptions>
          <StationMap station={vagonData?.train?.currentStation} />
        </>
      ) : (
        <Flex justify="center">
          <Image src={no} width={300} preview={false} />
        </Flex>
      )}
    </Card>
  );
}
