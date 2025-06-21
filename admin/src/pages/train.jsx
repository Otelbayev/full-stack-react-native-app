import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Table,
  message,
  Popconfirm,
  Tag,
  Flex,
  Row,
  Col,
  DatePicker,
} from "antd";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import dayjs from "dayjs";

export default function Trains() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [wagonsOpts, setWagonsOpts] = useState([]);
  const [routesOpts, setRoutesOpts] = useState([]);
  const [stationsOpts, setStationsOpts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [msg, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    fetchTrains();
    fetchWagons();
    fetchRoutes();
    fetchStations();
  };

  const fetchTrains = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/train`);
    if (res.status === 200) setData(res.data);
  };

  const fetchWagons = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/vagon`);
    if (res.status === 200) {
      setWagonsOpts(res.data.map((v) => ({ label: v.number, value: v._id })));
    }
  };

  const fetchRoutes = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/route`);
    if (res.status === 200) {
      setRoutesOpts(res.data.map((r) => ({ label: r.name, value: r._id })));
    }
  };

  const fetchStations = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/station`);
    if (res.status === 200) {
      setStationsOpts(
        res.data.map((s) => ({ label: `${s.name} (${s.code})`, value: s._id }))
      );
    }
  };

  const onFinish = async (vals) => {
    const payload = {
      name: vals.name,
      wagons: vals.wagons,
      route: vals.route,
      currentStation: vals.currentStation || null,
      status: vals.status,
      departureTime: vals.departureTime
        ? vals.departureTime.toISOString()
        : null,
      arrivalTime: vals.arrivalTime ? vals.arrivalTime.toISOString() : null,
    };
    try {
      msg.loading({
        key: "l",
        content: editingId ? "Yangilanmoqda..." : "Yaratilmoqda...",
        duration: 0,
      });
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/train/${editingId}`,
          payload
        );
        msg.success({ key: "l", content: "Yangilandi!" });
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/train`, payload);
        msg.success({ key: "l", content: "Yaratildi!" });
      }
      form.resetFields();
      setEditingId(null);
      fetchTrains();
    } catch {
      msg.error({ key: "l", content: "Xatolik!" });
    }
  };

  const handleEdit = (rec) => {
    setEditingId(rec._id);
    form.setFieldsValue({
      name: rec.name,
      wagons: rec.wagons.map((w) => w._id || w),
      route: rec.route._id || rec.route,
      currentStation: rec.currentStation?._id,
      status: rec.status,
      departureTime: rec.departureTime ? dayjs(rec.departureTime) : null,
      arrivalTime: rec.arrivalTime ? dayjs(rec.arrivalTime) : null,
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/train/${id}`);
    msg.success("O‘chirildi!");
    fetchTrains();
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
    { title: "Nomi", dataIndex: "name", key: "name" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag>{s}</Tag>,
    },
    { title: "Yo‘nalish", dataIndex: ["route", "name"], key: "route" },
    {
      title: "Jo‘nash vaqti",
      dataIndex: "departureTime",
      key: "departureTime",
      render: (d) => d && dayjs(d).format("dd.MM HH:mm"),
    },
    {
      title: "Yetib kelish vaqti",
      dataIndex: "arrivalTime",
      key: "arrivalTime",
      render: (d) => d && dayjs(d).format("dd.MM HH:mm"),
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, rec) => (
        <Flex gap={8}>
          <Button type="primary" onClick={() => handleEdit(rec)} size="small">
            <Edit size={16} />
          </Button>
          <Popconfirm onConfirm={() => handleDelete(rec._id)}>
            <Button type="primary" danger size="small">
              <Trash size={16} />
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Card
        title={
          editingId
            ? "Harakat tarkibini tahrirlash"
            : "Harakat tarkibini yaratish"
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Nomi" rules={[{ required: true }]}>
                <Input placeholder="Harakat tarkibi nomi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Holatini tanlang"
                  options={[
                    { label: "kutmoqda", value: "kutmoqda" },
                    { label: "yo‘lda", value: "yo‘lda" },
                    { label: "yetib keldi", value: "yetib keldi" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="wagons"
                label="Vagonlar"
                rules={[{ required: true }]}
              >
                <Select
                  mode="multiple"
                  options={wagonsOpts}
                  placeholder="Vagonlarni tanlang"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="route"
                label="Yo‘nalish"
                rules={[{ required: true }]}
              >
                <Select
                  options={routesOpts}
                  placeholder="Yo‘nalishni tanlang"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="currentStation" label="Hozirgi stansiya">
                <Select
                  options={stationsOpts}
                  allowClear
                  placeholder="Stansiyani tanlang"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="departureTime" label="Jo‘nash vaqti">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  placeholder="Jo‘nash vaqti"
                  disabledDate={(d) => d && d < dayjs().startOf("day")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="arrivalTime" label="Yetib kelish vaqti">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  placeholder="Kelish vaqti"
                  disabledDate={(d) => d && d < dayjs().startOf("day")}
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
