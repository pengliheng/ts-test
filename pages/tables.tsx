import axios from "axios";
import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  createContext
} from "react";
import { withRouter } from "next/router";
import "antd/dist/antd.css";
import { Table, Button, Divider, Input, InputNumber, Form } from "antd";
import { initialState, reducer } from "./reducer";
const FormItem = Form.Item;
const EditableContext = createContext({});

function EditableCell({
  title,
  index,
  record,
  editing,
  dataIndex,
  inputType,
  ...restProps
}) {
  const form: any = useContext(EditableContext);
  function getInput() {
    if (inputType === "number") {
      return <InputNumber />;
    }
    return <Input />;
  }
  const { getFieldDecorator } = form;
  return (
    <td {...restProps}>
      {editing ? (
        <FormItem style={{ margin: 0 }}>
          {getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ],
            initialValue: record[dataIndex]
          })(getInput())}
        </FormItem>
      ) : (
        restProps.children
      )}
    </td>
  );
}

function EditableTable({ form, router }) {
  const [users, dispatch] = useReducer(reducer, initialState);
  const [editingKey, setEditingKey] = useState("");
  useEffect(() => {
    axios
      .get(`http://localhost:3000/table/${router.query.name}/get`)
      .then((res: any) => {
        dispatch({ type: "get", payload: res.data.data });
      });
  }, []);
  function handleDelete({ _id }) {
    axios
      .get(`http://localhost:3000/table/${router.query.name}/delete/${_id}`)
      .then((res: any) => {
        if (res.data.success) {
          dispatch({ type: "delete", payload: _id });
        } else {
        }
      });
  }
  function handleCreate({ firstName = "", lastName = "", email = "" }) {
    axios
      .get(`http://localhost:3000/table/${router.query.name}/create`, {
        params: {
          firstName,
          lastName,
          email
        }
      })
      .then((res: any) => {
        if (res.data.success) {
          // success
          dispatch({ type: "create", payload: res.data.data });
        } else {
          // fail
        }
      });
  }
  function handleSave(form, _id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      axios
        .get(`http://localhost:3000/table/${router.query.name}/update/${_id}`, {
          params: row
        })
        .then((res: any) => {
          dispatch({ type: "update", payload: { ...row, _id } });
          handleCancel();
        });
    });
  }
  function isEditing(record) {
    return record._id === editingKey;
  }
  function handleEdit(key) {
    setEditingKey(key);
  }
  function handleCancel() {
    setEditingKey("");
  }

  const columns = [
    {
      title: "姓",
      dataIndex: "firstName",
      editable: true,
      key: "firstName"
    },
    {
      title: "名",
      dataIndex: "lastName",
      editable: true,
      key: "lastName"
    },
    {
      title: "邮箱",
      dataIndex: "email",
      editable: true,
      key: "email"
    },
    {
      title: "Action",
      key: "action",
      width: "30%",
      render: (text, record) => {
        const editable = isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <Button
                      type="primary"
                      onClick={() => handleSave(form, record._id)}
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </Button>
                  )}
                </EditableContext.Consumer>
                <Divider type="vertical" />
                <Button type="danger" onClick={() => handleCancel()}>
                  取消
                </Button>
              </span>
            ) : (
              <span>
                <Button type="dashed" onClick={() => handleEdit(record._id)}>
                  编辑
                </Button>
                <Divider type="vertical" />
                <Button type="danger" onClick={() => handleDelete(record)}>
                  删除
                </Button>
              </span>
            )}
          </div>
        );
      }
    }
  ].map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  return (
    <EditableContext.Provider value={form}>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => handleCreate({})}
      >
        Add a row
      </Button>
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        columns={columns}
        bordered
        locale={{ emptyText: <span>空</span> }}
        rowKey="_id"
        dataSource={users}
        pagination={{
          onChange: handleCancel
        }}
      />
    </EditableContext.Provider>
  );
}

const FormTables = Form.create()(withRouter(EditableTable));

export default function Tables() {
  return <FormTables />;
}
