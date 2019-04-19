import axios from "axios";
import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  createContext
} from "react";
import { Table, Button, Divider, Input, InputNumber, Form } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

import { initialState, reducer } from "./index.reducer";
const FormItem = Form.Item;
const EditableContext = createContext();

function EditableCell(props) {
  const {
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    ...restProps
  } = props;
  const form: {
    getFieldDecorator: (a: string, b) => (a: any) => React.ReactNode;
  } = useContext(EditableContext);
  const getInput = () => {
    if (inputType === "number") {
      return <InputNumber />;
    }
    return <Input />;
  };
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

function EditableTable(props) {
  // console.log(props);
  const [users, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  useEffect(() => {
    // setLoading(true);
    axios.get("http://localhost:3000/user/get").then((res: any) => {
      // setLoading(false);
      dispatch({ type: "get", payload: res.data.data });
    });
  }, []);
  // if (loading == true) {
  //   return <h5>数据加载中</h5>;
  // }
  if (users.length == 0) {
    return <h5>暂时没有数据</h5>;
  }
  function handleDelete({ _id }) {
    // useEffect(() => {
    // setLoading(true);
    axios.get(`http://localhost:3000/user/delete/${_id}`).then((res: any) => {
      // setLoading(false);
      if (res.data.success) {
        // success
        dispatch({ type: "delete", payload: _id });
      } else {
        // fail
      }
    });
    // }, []);
  }
  function handleCreate({
    firstName = "请填写",
    lastName = "请填写",
    email = "请填写"
  }) {
    // setLoading(true);
    axios
      .get(`http://localhost:3000/user/create`, {
        params: {
          firstName,
          lastName,
          email
        }
      })
      .then((res: any) => {
        setLoading(false);
        if (res.data.success) {
          // success
          dispatch({ type: "create", payload: res.data.data });
        } else {
          // fail
        }
      });
  }

  const isEditing = record => record._id === editingKey;

  const handleEdit = key => {
    setEditingKey(key);
  };

  const handleCancel = () => {
    setEditingKey("");
  };

  const columns = [
    {
      title: "姓名",
      dataIndex: "firstName",
      editable: true,
      key: "firstName"
    },
    {
      title: "lastName",
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
      width: "20%",
      render: (text, record) => {
        const editable = isEditing(record);
        // const form = useContext(EditableContext);
        return (
          <div>
            {editable ? (
              <span>
                <Button type="danger" onClick={() => handleCancel()}>
                  取消
                </Button>
                <Divider type="vertical" />
                <Button
                  type="primary"
                  // onClick={() => handleSave(form, record.key)}
                  style={{ marginRight: 8 }}
                >
                  保存
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

  const components = {
    body: {
      cell: EditableCell
    }
  };
  return (
    <EditableContext.Provider value={props.form}>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => handleCreate({})}
      >
        Add a row
      </Button>
      <Table
        components={components}
        columns={columns}
        bordered
        rowKey="_id"
        dataSource={users}
        pagination={{
          onChange: handleCancel
        }}
      />
    </EditableContext.Provider>
  );
}
const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;

// const MyContext = createContext();

// function Display() {
//   const value = useContext(MyContext);
//   return <div>{value}</div>;
// }

// function aaa() {
//   return (
//     <MyContext.Provider value={2342345}>
//       <div>
//         <Display />
//       </div>
//     </MyContext.Provider>
//   );
// }
