import { Card, Flex, message, Popconfirm, Table, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Switch, Button, Row, Col } from "antd";
import { Edit, Trash } from "lucide-react";

export default function Stations() {
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

      const payload = {
        ...values,
        location: {
          type: "Point",
          coordinates: [values.longitude, values.latitude],
        },
      };

      if (editingId) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/station/${editingId}`,
          payload
        );
        if (res.status === 200) {
          messageApi.success({ key: "loading", content: "Yangilandi!" });
        }
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/station`,
          payload
        );
        if (res.status === 201) {
          messageApi.success({ key: "loading", content: "Yaratildi!" });
        }
      }

      form.resetFields();
      setEditingId(null);
      getData();
    } catch (err) {
      messageApi.error({ key: "loading", content: "Xatolik yuz berdi!" });
    }
  };

  const getData = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/station`);
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
      latitude: record.location.coordinates[1],
      longitude: record.location.coordinates[0],
    });
  };

  const handleDelete = async (id) => {
    const res = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/station/${id}`
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
    { title: "Nomi", dataIndex: "name", key: "name" },
    { title: "Kodni", dataIndex: "code", key: "code" },
    { title: "Davlat", dataIndex: "country", key: "country" },
    { title: "Shahar", dataIndex: "city", key: "city" },
    { title: "Ochilgan yili", dataIndex: "openedYear", key: "openedYear" },
    { title: "Platformalar", dataIndex: "platforms", key: "platforms" },
    {
      title: "Holati",
      dataIndex: "isActive",
      key: "isActive",
      render: (val) => (
        <Tag color={val ? "green" : "red"}>{val ? "Faol" : "Faol emas"}</Tag>
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
      <Card
        title={editingId ? "Stansiyani tahrirlash" : "Yangi stansiya kiritish"}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{ isActive: true }}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Nomi" name="name" rules={[{ required: true }]}>
                <Input placeholder="Xodjikent stansiya" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Kodi" name="code" rules={[{ required: true }]}>
                <Input placeholder="722006" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Davlat"
                name="country"
                rules={[{ required: true }]}
              >
                <Input placeholder="O'zbekiston Respublikasi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Shahar"
                name="city"
                rules={[{ required: true }]}
              >
                <Input placeholder="Toshkent viloyati" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ochilgan yili" name="openedYear">
                <InputNumber
                  min={1900}
                  max={new Date().getFullYear()}
                  style={{ width: "100%" }}
                  placeholder="1994"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Platformalar soni" name="platforms">
                <InputNumber
                  min={1}
                  max={100}
                  style={{ width: "100%" }}
                  placeholder="1-100"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Latitude"
                name="latitude"
                rules={[
                  { required: true, message: "Latitude kiritilishi shart" },
                  {
                    type: "number",
                    min: -90,
                    max: 90,
                    message: "Latitude -90 dan 90 gacha bo‘lishi kerak",
                  },
                ]}
              >
                <InputNumber
                  placeholder="–90 dan +90 oralig‘ida"
                  min={-90}
                  max={90}
                  step={0.000001}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Longitude"
                name="longitude"
                rules={[
                  { required: true, message: "Longitude kiritilishi shart" },
                  {
                    type: "number",
                    min: -180,
                    max: 180,
                    message: "Longitude -180 dan 180 gacha bo‘lishi kerak",
                  },
                ]}
              >
                <InputNumber
                  placeholder="–180 dan +180 oralig‘ida"
                  min={-180}
                  max={180}
                  step={0.000001}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Faol" name="isActive" valuePropName="checked">
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
          dataSource={data.map((item) => ({ ...item, key: item._id }))}
          columns={columns}
          bordered
          size="small"
          rowKey="_id"
        />
      </Card>
    </>
  );
}
