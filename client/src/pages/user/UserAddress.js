import { DeleteOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { addAddresss, getAddresss, removeAddress } from '../../apis/cart'
import {
  getDistrictWards,
  getProvinceDistrict,
  getProvinces,
} from '../../apis/province'
import { UserLayouts } from '../../components/navigation/Layouts/Layouts'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import { EmptyBox } from '../../helpers/icons'

function UserAddress(props) {
  const [province, setProvince] = useState('')
  // const [district, setDistrict] = useState('')
  const [provinceDistrict, setProvinceDistrict] = useState('')
  const [districtWard, setDistrictWard] = useState('')
  const [valuesx, setValuesx] = useState([])
  const [valuess, setValuess] = useState([])
  const [valuesss, setValuesss] = useState([])
  const [listAddress, setListAddress] = useState([])
  const [addressId, setAddressId] = useState('')
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    getProvincess()
    loadUserAddress()
  }, [])

  function getProvincess() {
    getProvinces({})
      .then((res) => {
        setValuesx(res.data.provinces)
      })
      .catch((err) => console.log('Error anh em', err))
  }
  function getProvinceDistrictss(idProvince) {
    getProvinceDistrict(idProvince)
      .then((res) => {
        setValuess(res.data.districts)
      })
      .catch((err) => console.log('Error anh em', err))
  }
  function getDistrictWardss(idDistrict) {
    getDistrictWards(idDistrict)
      .then((res) => {
        setValuesss(res.data.wards)
      })
      .catch((err) => console.log('Error anh em', err))
  }
  function handleChanges(e) {
    setDistrictWard('')
    setProvinceDistrict('')
    const idProvince = e.target.value
    setProvince(idProvince)
    getProvinceDistrictss(idProvince)
  }
  function handleChangeProvinceDistrict(e) {
    const idDistrict = e.target.value
    setProvinceDistrict(idDistrict)
    if (province) {
      setDistrictWard('')
    }
    getDistrictWardss(idDistrict)
  }
  function handleChangeDistrictWard(e) {
    setDistrictWard(e.target.value)
  }
  function loadUserAddress() {
    getAddresss()
      .then((res) => {
        setListAddress(res.data.listUserAddress.address)
      })
      .catch((error) => {
        toast.error('L???i l???y ?????a ch???', error)
      })
  }
  function onHandleDelete(addressId) {
    setAddressId(addressId)
    setVisible(true)
  }
  function onHandleDeleted() {
    removeAddress(addressId)
      .then((res) => {
        toast.success('X??a ?????a ch??? th??nh c??ng')
        setVisible(false)
        loadUserAddress()
      })
      .catch((error) => {
        setVisible(false)
        toast.error('X??a ?????a ch??? th???t b???i')
      })
  }
  return (
    <React.Fragment>
      <Modal
        title="X??a ?????a ch??? giao h??ng"
        visible={visible}
        onOk={onHandleDeleted}
        onCancel={() => setVisible(false)}
        okText="Ch???p nh???n"
        cancelText="H???y"
      >
        <p>
          Khi b???n x??a ?????a ch??? giao h??ng hi???n t???i, b???n s???{' '}
          <span className="text-red-600">kh??ng th???</span> kh??i ph???c n??.
        </p>
      </Modal>
      <UserLayouts>
        <div className="w-full mx-auto bg-white rounded">
          <div className="px-3 pt-3 pb-8">
            <SectionTitle>
              Danh s??ch ?????a ch??? giao h??ng ({listAddress.length})
            </SectionTitle>
            {listAddress && listAddress.length > 0 ? (
              <div className=" mt-4">
                {/* <div className="uppercase pb-1 text-gray-600 font-semibold">
                  C??C ????N H??NG C???A B???N{' '}
                  <span className="text-gray-500 text-xs">({orderTotals})</span>
                </div> */}
                <div>
                  <div className="w-full">
                    <div className="bg-white shadow-md rounded my-4 overflow-x-auto">
                      <table className=" w-full table-auto">
                        <thead>
                          <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                            <th className="py-3 px-4 text-left">STT</th>
                            <th className="py-3 px-4 text-left">
                              T??n ng?????i nh???n
                            </th>
                            <th className="py-3 px-4 text-left">?????a ch???</th>
                            <th className="py-3 px-4 text-left">??i???n tho???i</th>

                            <th className="py-3 px-4 text-left">Thao t??c</th>
                          </tr>
                        </thead>
                        {listAddress &&
                          listAddress.map((addr, idx) => {
                            return (
                              <tbody className="text-gray-600 text-sm font-light">
                                <tr className="border-b border-gray-200 hover:bg-gray-100">
                                  <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <div className="flex items-center">
                                      <span className="font-medium">
                                        {idx + 1}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                      <span>{addr.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-6 text-center">
                                    <div className="">
                                      {addr.fullAddress} - {addr.mainAddress}
                                    </div>
                                  </td>
                                  <td className="py-3 px-6 text-center">
                                    <span className="">{addr.phone}</span>
                                  </td>

                                  <td className="py-3 px-6 text-center">
                                    <button
                                      onClick={() => onHandleDelete(addr._id)}
                                      className=" px-8 py-2 bg-red-500 text-blue-50 max-w-max shadow-sm hover:shadow-lg rounded"
                                    >
                                      <DeleteOutlined />
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            )
                          })}
                      </table>
                      {/* <div className="py-6 flex justify-center">
                        <Pagination
                          current={page}
                          total={(orderTotals / 10) * 10}
                          onChange={(value) => setPage(value)}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-3 mt-3 mx-auto ">
                <div className="flex justify-center">
                  <EmptyBox />
                </div>
              </div>
            )}

            <SectionTitle>Th??m ?????a ch??? giao h??ng</SectionTitle>
            <div>
              <Formik
                initialValues={{
                  name: '',
                  phone: '',
                  fullAddress: '',
                }}
                //  validate={values => {
                //    const errors = {};
                //    if (!values.email) {
                //      errors.email = 'Required';
                //    } else if (
                //      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                //    ) {
                //      errors.email = 'Invalid email address';
                //    }
                //    return errors;
                //  }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  const valuesss = { ...values, mainAddress: districtWard }
                  addAddresss(valuesss).then((res) => {
                    loadUserAddress()
                    resetForm({})
                    setProvince('')
                    setProvinceDistrict('')
                    setDistrictWard('')
                  })
                  setSubmitting(false)
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  /* and other goodies */
                }) => (
                  <form onSubmit={handleSubmit} className="mx-0 w-full">
                    <div className="my-5 px-0 md:px-4">
                      <div className="my-2 flex items-center justify-between">
                        <span> H??? v?? t??n ng?????i nh???n </span>
                        <input
                          type="text"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          placeholder="Nh???p h??? v?? t??n ng?????i nh???n"
                          className="ml-2 py-2 w-align border px-3 text-grey-darkest rounded"
                        />
                      </div>
                      <div className="my-2 flex items-center justify-between">
                        <span> S??? ??i???n tho???i </span>
                        <input
                          type="text"
                          name="phone"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.phone}
                          placeholder="Nh???p s??? ??i???n tho???i"
                          className="ml-2 py-2 w-align border px-3 text-grey-darkest rounded"
                        />
                      </div>
                      <div className="my-2 flex items-center justify-between">
                        <span> T???nh/Th??nh Ph??? </span>
                        <select
                          type="select"
                          placeholder="Ch???n t???nh/th??nh ph???"
                          className="ml-2 py-2 w-align border px-3 text-grey-darkest rounded"
                          value={province}
                          defaultValue="Ch???n t???nh/th??nh ph???"
                          onChange={handleChanges}
                          required
                        >
                          <option value="">Ch???n t???nh/th??nh ph???</option>
                          {valuesx &&
                            valuesx.map((arr) => {
                              return (
                                <option key={arr._id} value={arr.code}>
                                  {arr.name}
                                </option>
                              )
                            })}
                        </select>
                      </div>
                      <div className="my-2 flex items-center justify-between">
                        <span> Qu???n/Huy???n</span>
                        <select
                          type="select"
                          className="ml-2 py-2 w-align border px-3 text-grey-darkest rounded"
                          value={provinceDistrict}
                          onChange={handleChangeProvinceDistrict}
                          disabled={province ? false : true}
                          required
                        >
                          <option value="" disabled selected hidden>
                            Ch???n qu???n/huy???n
                          </option>
                          {valuess &&
                            valuess.map((arr) => {
                              return (
                                <option key={arr._id} value={arr.code}>
                                  {arr.name}
                                </option>
                              )
                            })}
                        </select>
                      </div>
                      <div className="my-2 flex items-center justify-between">
                        <span> Ph?????ng/X??</span>
                        <select
                          type="select"
                          // name="mainAddress"
                          className="ml-2 py-2 w-align border px-3 text-grey-darkest rounded"
                          value={districtWard}
                          onChange={handleChangeDistrictWard}
                          disabled={provinceDistrict ? false : true}
                          required
                        >
                          <option value="" disabled selected hidden>
                            Ch???n ph?????ng/x??
                          </option>
                          {valuesss &&
                            valuesss.map((arr) => {
                              return (
                                <option key={arr._id} value={arr.full_name}>
                                  {arr.name}
                                </option>
                              )
                            })}
                        </select>
                      </div>
                      <div className="my-2 flex items-center justify-between">
                        <span> ?????a ch??? nh???n h??ng</span>
                        <input
                          type="text"
                          name="fullAddress"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.fullAddress}
                          placeholder="Nh???p ?????a ch??? nh???n h??ng"
                          className="ml-2 py-2 w-align border px-3 text-grey-darkest rounded calc"
                        />
                      </div>
                    </div>

                    <div className="px-4 py-3 text-center sm:px-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-1/2 font-semibold"
                      >
                        L??u
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </UserLayouts>
    </React.Fragment>
  )
}

export default UserAddress
