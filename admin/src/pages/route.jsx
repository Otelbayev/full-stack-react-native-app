import {
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Button,
  Table,
  Tag,
  message,
  Popconfirm,
  Flex,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";

export default function RoutePage() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [stations, setStations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const getStations = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/station`);
    if (res.status === 200) {
      const options = res.data
        .filter((st) => st.isActive)
        .map((st) => ({
          label: `${st.name} (${st.code})`,
          value: st._id,
        }));
      setStations(options);
    }
  };

  const getRoutes = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/route`);
    if (res.status === 200) {
      setData(res.data);
    }
  };

  const onFinish = async (values) => {
    const payload = {
      name: values.name,
      distance: values.distance,
      estimatedTime: values.estimatedTime,
      stations: values.stations.map((id, i) => ({
        stationId: id,
        order: i + 1,
      })),
    };

    try {
      messageApi.loading({
        key: "loading",
        content: "Saqlanmoqda...",
        duration: 0,
      });

      if (editingId) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/route/${editingId}`,
          payload
        );
        if (res.status === 200) {
          messageApi.success({
            key: "loading",
            content: "Muvaffaqiyatli yangilandi!",
          });
        }
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/route`,
          payload
        );
        if (res.status === 201) {
          messageApi.success({
            key: "loading",
            content: "Muvaffaqiyatli yaratildi!",
          });
        }
      }

      form.resetFields();
      setEditingId(null);
      getRoutes();
    } catch (error) {
      messageApi.error({ key: "loading", content: "Xatolik yuz berdi!" });
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      name: record.name,
      distance: record.distance,
      estimatedTime: record.estimatedTime,
      stations: record.stations.map((s) => s.stationId._id || s.stationId),
    });
  };

  const handleDelete = async (id) => {
    const res = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/route/${id}`
    );
    if (res.status === 200) {
      messageApi.success("Yo‘nalish o‘chirildi!");
      getRoutes();
    }
  };

  const columns = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
      align: "center",
      width: 40,
    },
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Masofa (km)",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "Tahminiy vaqt (min)",
      dataIndex: "estimatedTime",
      key: "estimatedTime",
    },
    {
      title: "Stansiyalar",
      key: "stations",
      render: (_, record) => (
        <>
          {}
          {record.stations.map((s, i) => {
            const sss = stations.find((e) => e?.value === s?.stationId);
            return <Tag key={sss?.value}>{sss?.label}</Tag>;
          })}
        </>
      ),
    },
    {
      title: "Amallar",
      key: "action",
      render: (_, record) => (
        <Flex gap={8}>
          <Button
            onClick={() => handleEdit(record)}
            type="primary"
            size="small"
          >
            <Edit size={16} />
          </Button>
          <Popconfirm
            title="O‘chirishni istaysizmi?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger type="primary" size="small">
              <Trash size={16} />
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    getStations();
    getRoutes();
  }, []);

  return (
    <>
      {contextHolder}
      <Card title={editingId ? "Yo‘nalishni tahrirlash" : "Yo‘nalish yaratish"}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Yo‘nalish nomi"
                rules={[{ required: true }]}
              >
                <Input placeholder="Masalan: Toshkent - Andijon" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="distance" label="Masofa (km)">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="estimatedTime" label="Vaqt (min)">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="stations"
                label="Stansiyalar"
                rules={[{ required: true }]}
              >
                <Select
                  mode="multiple"
                  options={stations}
                  placeholder="Stansiyalarni tanlang"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? "Yangilash" : "Saqlash"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Table
          rowKey="_id"
          dataSource={data}
          columns={columns}
          bordered
          size="small"
        />
      </Card>
    </>
  );
}
