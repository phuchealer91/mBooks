import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SearchItem } from '../../../components/LocalSearch'
import { ModalConfirm } from '../../../components/ModalConfirm'
import { Layouts } from '../../../components/navigation/Layouts/Layouts'
import SectionTitle from '../../../components/SectionTitle/SectionTitle'
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
} from '../../../redux/actions/coupon'
import FormCoupon from './FormCoupon'

const CreateCoupon = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const [couponDelete, setCouponDelete] = useState(null)
  const [keyword, setKeyword] = useState('')

  const couponList = useSelector((state) => state.coupon.couponList)
  const totalCoupon = couponList.length
  useEffect(() => {
    dispatch(getCoupon())
  }, [dispatch])

  function onFinish(fieldsValue) {
    const values = {
      ...fieldsValue,
      expiry: fieldsValue['expiry'].format('YYYY-MM-DD HH:mm:ss'),
    }
    dispatch(createCoupon(values))
    form.resetFields()
  }
  function onHandleDelete(id) {
    setShowModal(true)
    setCouponDelete(id)
  }
  function onHandleDeleteItem() {
    dispatch(deleteCoupon(couponDelete))
    setShowModal(false)
  }
  function closeModal() {
    setShowModal(false)
  }
  function TimeExpiry(start, end) {
    const starts = new Date(start).getTime()
    const ends = new Date(end).getTime()
    const time = Math.ceil((ends - starts) / (1000 * 3600 * 24))
    return time
  }
  // Search
  const searched = (keyword) => (coupon) =>
    coupon.name.toLowerCase().includes(keyword)
  const dataSource =
    couponList &&
    couponList.filter(searched(keyword)).map((item) => ({
      Id: item._id,
      Name: item.name,
      Discount: item.discount,
      CreatedAt: new Date(item.createdAt).toLocaleString(),
      Expiry: new Date(item.expiry).toLocaleString(),
      Status: TimeExpiry(item.createdAt, item.expiry),
    }))
  const columns = [
    {
      title: 'M??',
      dataIndex: 'Id',
      key: 'id',
    },
    {
      title: 'T??n',
      dataIndex: 'Name',
      key: 'name',
    },
    {
      title: '%',
      dataIndex: 'Discount',
      key: 'discount',
    },
    {
      title: 'B???t ?????u',
      dataIndex: 'CreatedAt',
      key: 'createdAt',
    },
    {
      title: 'H???t h???n',
      dataIndex: 'Expiry',
      key: 'expiry',
    },
    {
      title: 'Tr???ng th??i',
      dataIndex: 'Status',
      key: 'status',
      render: (record) => {
        return record > 0 ? (
          <Tag color="green-inverse">C??n h???n</Tag>
        ) : (
          <Tag color="red-inverse">H???t h???n</Tag>
        )
      },
    },
    {
      title: 'Thao t??c',
      dataIndex: '',
      key: 'x',

      render: (text, record) => (
        <>
          {/* <Button type="primary" className="mr">
            <Link
              to={`/admin/coupon/${record.Slug}`}
              className="category__edit"
            >
              <span className="category__icon">
                <EditOutlined />
              </span>
              S???a
            </Link>
          </Button> */}
          <Button
            type="primary"
            danger
            onClick={(e) => {
              onHandleDelete(record.Id, e)
            }}
            className="flex items-center rounded"
          >
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ]
  return (
    <React.Fragment>
      <ModalConfirm
        showModal={showModal}
        closeModal={closeModal}
        onHandleDeleteItem={onHandleDeleteItem}
        title="M?? gi???m gi??"
        categoryToDelete={couponDelete}
      />

      <Layouts>
        <SectionTitle>Qu???n l?? m?? khuy???n m??i/gi???m gi??</SectionTitle>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-sm text-gray-600 pb-3"> T???o m???i m?? khuy???n m??i</h3>
          <Form form={form} onFinish={onFinish}>
            <FormCoupon />
          </Form>
          <h3 className="text-sm text-gray-600 pb-1">
            {' '}
            Danh s??ch c??c m?? khuy???n m??i{' '}
            <span className="font-semibold">({totalCoupon})</span>
          </h3>
          {/* Search */}
          <SearchItem keyword={keyword} setKeyword={setKeyword} />
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="Id"
            tableLayout="auto"
            bordered
            className="rounded"
            pagination={{ position: ['bottomCenter'] }}
            scroll={{ x: '374px' }}
            sticky
          />
        </div>
      </Layouts>
    </React.Fragment>
  )
}

CreateCoupon.propTypes = {}

export default CreateCoupon
