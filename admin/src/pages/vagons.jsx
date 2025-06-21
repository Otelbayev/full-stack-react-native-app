import { Card, Flex, message, Popconfirm, Table, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Switch,
  Button,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import { Edit, Trash } from "lucide-react";

export default function Vagons() {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [editingId, setEditingId] = useState(null);

  const onFinish = async (values) => {
    try {
      messageApi.loading({
        key: "loading",
        content: editingId ? "Yangilanmoqda..." : "Yaratilmoqda...",
        duration: 0,
      });

      if (editingId) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/vagon/${editingId}`,
          values
        );
        if (res.status === 200) {
          messageApi.success({
            key: "loading",
            content: "Yangilandi!",
          });
        }
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/vagon`,
          values
        );
        if (res.status === 201) {
          messageApi.success({
            key: "loading",
            content: "Yaratildi!",
          });
        }
      }
      form.resetFields();
      setEditingId(null);
      getData();
    } catch (error) {
      messageApi.error({
        key: "loading",
        content: "Xatolik yuz berdi!",
      });
    }
  };

  const getData = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/vagon`);
    if (res.status === 200) {
      setData(res.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      ...record,
      lastInspection: record.lastInspection
        ? dayjs(record.lastInspection)
        : null,
    });
  };

  const handleDelete = async (id) => {
    const res = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/vagon/${id}`
    );
    if (res.status === 200) {
      messageApi.success("Muvaffaqiyatli o'chirildi!");
      getData();
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
    { title: "Raqami", dataIndex: "number", key: "number" },
    { title: "Turi", dataIndex: "type", key: "type" },
    {
      title: "Sig‘imi (tonna)",
      dataIndex: "capacityTons",
      key: "capacityTons",
    },
    { title: "Hajmi (m³)", dataIndex: "volumeM3", key: "volumeM3" },
    { title: "O‘qlar", dataIndex: "axles", key: "axles" },
    { title: "Yili", dataIndex: "yearBuilt", key: "yearBuilt" },
    { title: "Ega", dataIndex: "owner", key: "owner" },
    {
      title: "Ko‘rik",
      dataIndex: "lastInspection",
      key: "lastInspection",
      render: (text) =>
        text ? new Date(text).toLocaleDateString("uz-UZ") : "-",
    },
    {
      title: "Holati",
      dataIndex: "isOperational",
      key: "isOperational",
      render: (val) =>
        val ? (
          <Tag color="green">Ishlayapti</Tag>
        ) : (
          <Tag color="red">Nosoz</Tag>
        ),
    },
    {
      title: "Amal",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Flex gap={2}>
          <Button
            onClick={() => handleEdit(record)}
            type="primary"
            size="small"
          >
            <Edit size={18} />
          </Button>
          <Popconfirm
            onCancel={() => setEditingId(null)}
            title="O'chirilsinmi?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="primary" size="small" danger>
              <Trash size={18} />
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Card title={editingId ? "Vagonni tahrirlash" : "Omborga vagon kiritish"}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ axles: 4, isOperational: true }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Vagon raqami"
                name="number"
                rules={[
                  { required: true, message: "Vagon raqamini kiriting!" },
                ]}
              >
                <Input placeholder="Masalan: VG123456" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Turi"
                name="type"
                rules={[{ required: true, message: "Vagon turini kiriting!" }]}
              >
                <Input placeholder="Masalan: Yuk, Yo‘lovchi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Sig‘imi (tonna)"
                name="capacityTons"
                rules={[{ required: true, message: "Sig‘imni kiriting!" }]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="60" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hajmi (m³)" name="volumeM3">
                <InputNumber style={{ width: "100%" }} placeholder="120" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="O‘qlar soni" name="axles">
                <InputNumber min={2} max={12} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ishlab chiqarilgan yil" name="yearBuilt">
                <InputNumber
                  min={1900}
                  max={new Date().getFullYear()}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Egasining nomi" name="owner">
                <Input placeholder="Temiryo‘l kompaniyasi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Oxirgi texnik ko‘rik" name="lastInspection">
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ish holatida"
                name="isOperational"
                valuePropName="checked"
              >
                <Switch />
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
          dataSource={data.map((item, index) => ({
            ...item,
            index,
          }))}
          columns={columns}
          bordered
          size="small"
          rowKey="_id"
        />
      </Card>
    </>
  );
}
