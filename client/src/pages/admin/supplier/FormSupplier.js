import { ShopOutlined } from '@ant-design/icons'
import { Form, Input } from 'antd'
import React from 'react'
const FormSupplier = () => {
  return (
    <React.Fragment>
      <Form.Item
        rules={[
          {
            required: true,
            message: 'Nhà cung cấp không được để trống',
          },
          { min: 3, message: 'Nhà cung cấp phải có ít nhất 3 ký tự.' },
          { max: 32, message: 'Nhà cung cấp tối đa có 32 ký tự.' },
        ]}
        name="name"
        className="mr-3 w-1/2"
      >
        <Input
          prefix={<ShopOutlined />}
          placeholder="Nhập tên nhà cung cấp"
          className="rounded py-2 text-base"
        />
      </Form.Item>
    </React.Fragment>
  )
}
FormSupplier.propTypes = {}

export default FormSupplier
