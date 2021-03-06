import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { addAddresss } from '../../apis/cart'
import { getFees } from '../../apis/fee'
import {
  getDistrictWards,
  getProvinceDistrict,
  getProvinces,
} from '../../apis/province'
import { formatPrice } from '../../helpers/formatPrice'

function Addressx(props) {
  const history = useHistory()
  const [province, setProvince] = useState('')
  // const [district, setDistrict] = useState('')
  const [provinceDistrict, setProvinceDistrict] = useState('')
  const [districtWard, setDistrictWard] = useState('')
  const [valuesx, setValuesx] = useState([])
  const [valuess, setValuess] = useState([])
  const [valuesss, setValuesss] = useState([])
  const [fees, setFees] = useState([])
  useEffect(() => {
    getProvincess()
    loadFees()
  }, [])

  function loadFees() {
    getFees({})
      .then((res) => {
        setFees(res.data.fee)
      })
      .catch((err) => console.log('Error anh em', err))
  }
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
  function setFeeShip() {
    const shipping =
      fees &&
      fees.filter(
        (item) =>
          districtWard?.split(',')[2].toLowerCase().trim() ===
          item.area.toLowerCase().trim()
      )[0]
    if (shipping && shipping.feeShipping) {
      return shipping.feeShipping
    } else {
      return 30000
    }
  }
  return (
    <div>
      <div className="xl:max-w-7xl mx-auto bg-white rounded">
        <div className="px-3 pt-3 pb-8">
          <div className="uppercase border-b border-gray-100 pb-1 text-gray-700 font-semibold  border-solid px-4">
            ?????A CH??? GIAO H??NG
          </div>
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
              onSubmit={(values, { setSubmitting }) => {
                const valuesss = {
                  ...values,
                  mainAddress: districtWard,
                  feeShip: setFeeShip(),
                }
                addAddresss(valuesss).then((res) => {
                  history.push('/check-out')
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
                  <div className="my-5 px-4">
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
                    <div className="my-2 flex items-center">
                      <span>
                        Ph?? v???n chuy???n c???a khu v???c{' '}
                        <span className="text-gray-600 font-semibold">
                          {districtWard}
                        </span>
                        :{' '}
                      </span>
                      {districtWard && (
                        <div className="ml-2 text-red-500 font-semibold text-base">
                          {formatPrice(setFeeShip())}??
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-3 text-center sm:px-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-1/2"
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
    </div>
  )
}

export default Addressx
