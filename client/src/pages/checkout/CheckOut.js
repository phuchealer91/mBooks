import {
  CheckCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Modal, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  applyAddressCarts,
  applyCouponCarts,
  createCashOrders,
  emptyCarts,
  getAddresss,
  getUserCarts,
  removeAddress,
} from '../../apis/cart'
import Loading from '../../components/Notify/Loading'
import { formatPrice, formatPriceSale } from '../../helpers/formatPrice'
import { addToCart } from '../../redux/actions/cart'
import { appliedCoupon } from '../../redux/actions/coupon'

function CheckOut(props) {
  const dispatch = useDispatch()
  const { COD } = useSelector((state) => state)
  const { isCoupons } = useSelector((state) => state.coupon)
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  // const [isSubmitAddr, setIsSubmitAddr] = useState(false)
  const [addressSaved, setAddressSaved] = useState(null)
  const [listAddress, setListAddress] = useState([])
  const [coupons, setCoupons] = useState('')
  const [addressId, setAddressId] = useState('')
  const [visible, setVisible] = useState(false)
  // discount price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  useEffect(() => {
    getUserCarts().then((res) => {
      setProducts(res.data.products)
      setTotal(res.data.cartTotal)
    })
    loadUserAddress()
  }, [])

  const onHandleEmptyCart = () => {
    // remove from local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
    }
    // remove from redux
    dispatch(addToCart([]))
    // remove from backend
    emptyCarts().then((res) => {
      setProducts([])
      setTotal(0)
      setTotalAfterDiscount(0)
      setCoupons('')
      toast.success('Gi??? h??ng r???ng. Ch??c b???n ti???p t???c mua s???n ph???m vui v???.')
      history.push('/')
    })
  }
  function loadUserAddress() {
    setIsLoading(true)
    getAddresss()
      .then((res) => {
        setIsLoading(false)
        setListAddress(res.data.listUserAddress.address)
        setAddressSaved(res.data.listUserAddress.address[0])
        applyAddressCarts({
          deliveryAddress: res.data.listUserAddress.address[0],
        })
      })
      .catch((error) => {
        toast.error('L???i l???y ?????a ch???', error)
      })
  }

  function confirm(_id) {
    Modal.confirm({
      title: 'X??c nh???n x??a ?????a ch??? giao h??ng',
      icon: <ExclamationCircleOutlined />,
      content:
        'Sau khi x??a ?????a ch??? giao h??ng b???n s??? kh??ng th??? kh??i ph???c n??. B???n ch???c ch???n mu???n x??a ch????',
      okText: 'X??a',
      cancelText: 'H???y',
      onOk: () => {
        removeAddress(_id)
          .then((res) => {
            toast.success('X??a ?????a ch??? th??nh c??ng')
            setVisible(false)
            loadUserAddress()
          })
          .catch((error) => {
            setVisible(false)
            toast.error('X??a ?????a ch??? th???t b???i')
          })
      },
    })
  }

  function onHandleAddressSelected(deliveryAddress) {
    setAddressSaved(deliveryAddress)

    applyAddressCarts({ deliveryAddress })
      .then((res) => {
        if (res.data) {
          toast.success('Ch???n ?????a ch??? giao h??ng th??nh c??ng')
          // setIsSubmitAddr(true)
        }
      })
      .catch((error) => {
        // setIsSubmitAddr(false)
        toast.error('Ch???n ?????a ch??? giao h??ng th???t b???i')
      })
  }

  function onHandleApplyCoupon() {
    applyCouponCarts({ coupons })
      .then((res) => {
        if (res.data) {
          setTotalAfterDiscount(res.data.totalAfterDiscount.totalAfterDiscount)
          dispatch(appliedCoupon(true))
        }
        toast.success('??p d???ng m?? khuy???n m??i th??nh c??ng')
      })
      .catch((error) => {
        toast.error('??p d???ng m?? khuy???n m??i th???t b???i', error)
        dispatch(appliedCoupon(false))
      })
  }
  function onHandlePayMent() {
    if (!addressSaved || !products.length) {
      return toast.error('Vui l??ng c???p nh???t ?????a ch??? giao h??ng')
    } else {
      history.push('/payment')
    }
  }
  function onHandlePayMentCash() {
    if (!addressSaved || !products.length) {
      return toast.error('Vui l??ng c???p nh???t ?????a ch??? giao h??ng')
    } else {
      createCashOrders({ COD, isCoupons })
        .then((res) => {
          if (res.data.order) {
            if (typeof window !== 'undefined') localStorage.removeItem('cart')
          }
          toast.success('Thanh to??n th??nh c??ng')
          confirmOrder()
          dispatch(addToCart([]))
          dispatch(appliedCoupon(false))
          emptyCarts()
        })
        .catch((error) => {
          toast.error('?????t h??ng th???t b???i !')
        })
    }
  }
  function confirmOrder() {
    Modal.confirm({
      title: 'X??c nh???n ?????t h??ng',
      icon: <CheckCircleOutlined />,
      content: 'Ch??c m???ng. B???n ???? ?????t h??ng th??nh c??ng !',
      okText: 'X??c nh???n',
      onOk: () => {
        history.push('/user/history')
      },
    })
  }
  return (
    <div>
      <div className="xl:max-w-7xl mx-auto bg-white rounded mt-4">
        <div className="px-3 pt-3 pb-8">
          <div className="uppercase border-b border-gray-100 pb-1 text-gray-600 font-semibold  border-solid px-4">
            T???T C??? ?????A CH??? ({listAddress.length})
          </div>
          <div className="my-3 mx-3 flex items-center">
            <span>B???n mu???n giao h??ng ?????n ?????a ch??? kh??c?</span>
            <Link
              // disabled={districtWard || !products.length}
              onClick={() => history.push('/address')}
              className="text-blue-600  bg-transparent px-2"
            >
              Th??m ?????a ch??? giao h??ng m???i
            </Link>
          </div>

          <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
            {isLoading ? (
              <Loading />
            ) : listAddress.length > 0 ? (
              <table className=" w-full table-auto text-center ">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                    <th className="py-3 px-4 text-left">STT</th>
                    <th className="py-3 px-4 text-left">T??n</th>
                    <th className="py-3 px-4 text-left">?????a ch???</th>
                    <th className="py-3 px-4 text-left">Ph?? v???n chuy???n</th>
                    <th className="py-3 px-4 text-left">SDT</th>
                    <th className="py-3 px-4 text-left">Thao t??c</th>
                  </tr>
                </thead>

                {listAddress.map((addr, idx) => (
                  <tbody
                    className="text-gray-600 text-sm font-light"
                    key={addr._id}
                  >
                    <tr
                      className={`border-b border-gray-200 hover:bg-gray-200 ${
                        addressSaved && addr._id === addressSaved?._id
                          ? 'bg-blue-200 '
                          : 'bg-gray-100'
                      } `}
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-medium">{idx + 1}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <span className="font-semibold">{addr.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left  w-2/6">
                        {idx === 0 && addr._id === addressSaved?._id ? (
                          <Tag color="green-inverse">M???c ?????nh</Tag>
                        ) : (
                          ''
                        )}
                        <div className="mt-2">
                          {addr.fullAddress} - {addr.mainAddress}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="text-left">
                          <Tag
                            color="magenta"
                            className="text-gray-600 font-semibold"
                          >
                            {formatPrice(addr.feeShip)}??
                          </Tag>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="text-left">{addr.phone}</div>
                      </td>

                      <td className="py-3 px-6  flex items-center">
                        <button
                          onClick={() => onHandleAddressSelected(addr)}
                          className=" px-4 py-2 mr-2 bg-blue-600 text-blue-50 max-w-max shadow-sm hover:shadow-lg rounded"
                        >
                          Giao ?????n ????y
                        </button>

                        <button
                          onClick={() => confirm(addr._id)}
                          className=" px-4 py-2 bg-red-500 text-blue-50 max-w-max shadow-sm hover:shadow-lg rounded"
                        >
                          <DeleteOutlined />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            ) : (
              <div className=" px-4 py-3 mt-3 flex justify-center items-center">
                <div>
                  <span className="text-red-600 font-semibold text-sm">
                    Hi???n t???i b???n ch??a c?? ?????a ch??? ????? ch??ng t??i giao h??ng !{' '}
                  </span>
                  <button
                    // disabled={districtWard || !products.length}
                    onClick={() => history.push('/address')}
                    className="text-blue-600 btn btn-addToCart uppercase mx-auto w-full mt-2 bg-transparent border border-blue-600 border-solid"
                  >
                    B???m v??o ????y ????? th??m ?????a ch??? giao h??ng
                  </button>
                </div>
              </div>
            )}
            {/* <div className="py-6 flex justify-center items-center">
              <Pagination
                current={page}
                total={(usersTotal / 10) * 10}
                onChange={(value) => setPage(value)}
              />
            </div> */}
          </div>
        </div>
      </div>
      <div className="xl:max-w-7xl mx-auto bg-white rounded mt-4">
        <div className="px-3 pt-3 pb-8">
          <div className="uppercase border-b border-gray-100 pb-1 text-gray-700 font-semibold  border-solid px-4">
            M?? KHUY???N M??I/M?? QU?? T???NG
          </div>
          <div className="px-3 pt-3 flex items-center">
            <h3>M?? KM/Qu?? t???ng </h3>
            <input
              type="text"
              name="coupon"
              onChange={(e) => {
                setCoupons(e.target.value)
              }}
              value={coupons}
              placeholder="Nh???p m?? khuy???n m??i/qu?? t???ng"
              className="ml-2 py-2 border px-3 text-grey-darkest rounded w-2/6"
            />
            <button
              onClick={onHandleApplyCoupon}
              className="text-white btn mt-2 bg-red-500 border border-solid ml-3 px-4 py-2"
            >
              ??p d???ng
            </button>
          </div>
        </div>
      </div>
      {/* dia chi giao hang */}
      <div className="xl:max-w-7xl mx-auto bg-white rounded mt-4">
        <div className="px-3 pt-3 pb-8">
          <div className="uppercase border-b border-gray-100 pb-1 text-gray-700 font-semibold  border-solid px-4">
            KI???M TRA L???I ????N H??NG
          </div>
          {products &&
            products.map((item, i) => {
              return (
                <div className="">
                  <div className="py-3 flex-row justify-between items-center mb-0 block md:flex">
                    <div className="w-full md:w-align flex flex-row items-start border-b-0 border-grey-dark pt-0 pb-0 pl-3 text-left">
                      <div className="w-24 mx-0 relative pr-0 mr-3 md:w-20  ">
                        <div className="h-24 md:h-20 rounded flex items-center justify-center">
                          <div className=" w-full">
                            <img
                              src={item && item.product?.images[1]?.url}
                              alt="book"
                              className="dra__wrap-avatar"
                              style={{
                                objectFit: 'cover',
                                width: '80px',
                                height: '80px',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-start items-start">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-hk text-secondary text-base"
                        >
                          {item.product.title}
                        </Link>
                        <div className="my-1  ">
                          {item.product.sale > 0 ? (
                            <div className="flex items-center">
                              <div className="mr-4 text-blue-600 text-base font-semibold">
                                {formatPriceSale(
                                  item.product.price,
                                  item.product.sale
                                )}
                                ??
                              </div>
                              <div className=" text-gray-400 text-sm line-through">
                                {formatPrice(item.product.price)}??
                              </div>{' '}
                            </div>
                          ) : (
                            <div className="text-blue-600 text-base font-semibold">
                              {formatPrice(item.product.price)}??
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-1/5 pr-10 xl:pr-10 pb-4 flex flex-col items-start justify-end pl-3 md:items-center md:pl-0">
                      <div className="custom-number-input w-32">
                        <div className="text-blue-700 text-base font-semibold">
                          <span className="text-xs text-gray-500">
                            S??? l?????ng:
                          </span>{' '}
                          {item.count}
                        </div>
                      </div>
                      <div className=" text-blue-700 text-base font-semibold">
                        <span className="text-xs text-gray-500">
                          Th??nh ti???n:
                        </span>{' '}
                        {formatPriceSale(
                          item.product.price * item.count,
                          item.product.sale
                        )}
                        ??
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
      <div className="xl:max-w-7xl mx-auto bg-white rounded mt-4">
        <div className="px-3 pt-3 pb-8">
          <div className="uppercase border-b border-gray-100 pb-1 text-gray-700 font-semibold  border-solid px-4">
            X??C NH???N THANH TO??N
          </div>
          <div className="px-3 pt-3 text-left md:text-right">
            <div className="  text-base font-semibold">
              <span className="text-base text-gray-500">Th??nh ti???n:</span>{' '}
              <span className="text-lg text-gray-600">
                {formatPrice(total)}??
              </span>
            </div>
            <div className=" text-base font-semibold">
              <span className="text-base text-gray-500">
                Sau khi ??p d???ng m?? khuy???n m??i:
              </span>{' '}
              <span className="text-lg text-red-500">
                {totalAfterDiscount > 0 ? formatPrice(totalAfterDiscount) : '0'}
                ??
              </span>
            </div>
            <div className=" text-base font-semibold">
              <span className="text-base text-gray-500">Ph?? v???n chuy???n:</span>{' '}
              <span className="text-lg text-red-500">
                {formatPrice(addressSaved?.feeShip)}
              </span>
            </div>
            <div className=" text-blue-600 text-xl font-semibold">
              <span className="text-lg text-gray-600">
                T???ng S??? Ti???n (g???m VAT):
              </span>{' '}
              {totalAfterDiscount > 0
                ? formatPrice(
                    addressSaved?.feeShip > 0
                      ? totalAfterDiscount + addressSaved?.feeShip
                      : totalAfterDiscount
                  )
                : formatPrice(
                    addressSaved?.feeShip > 0
                      ? total + addressSaved?.feeShip
                      : total
                  )}
              ??
            </div>
          </div>
          <div className="flex items-center justify-between px-3 md:justify-end">
            <button
              onClick={onHandleEmptyCart}
              disabled={!products.length}
              className="mr-1 btn bg-red-500 px-4 py-3 uppercase text-white w-1/2 md:w-1/4 mt-2 font-semibold"
            >
              X??a ????n h??ng
            </button>
            {COD ? (
              <button
                disabled={!addressSaved || !products.length}
                onClick={onHandlePayMentCash}
                className={`${
                  !addressSaved || !products.length
                    ? 'opacity-50'
                    : 'opacity-100'
                } hover:bg-blue-600 btn  bg-blue-500  px-3 py-3 uppercase w-1/2 md:w-1/4 mt-2 font-semibold text-white`}
              >
                ?????t h??ng
              </button>
            ) : (
              <button
                disabled={!addressSaved || !products.length}
                onClick={onHandlePayMent}
                className={`${
                  !addressSaved || !products.length
                    ? 'opacity-50'
                    : 'opacity-100'
                } hover:bg-blue-600 btn  bg-blue-500  px-3 py-3 uppercase w-1/2 md:w-1/4 mt-2 font-semibold text-white`}
              >
                ?????t h??ng
              </button>
            )}
          </div>
          {!addressSaved || !products.length ? (
            <div className="text-red-500 text-xs py-2 px-3 text-right">
              C?? th??? b???n ch??a c???p nh???t ?????a ch??? giao h??ng ho???c gi??? h??ng b???n r???ng
              !
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}
CheckOut.propTypes = {}

export default CheckOut
