import React, {useState} from 'react';
import {itemTableColumns, deleteItemButton, insertItemForm, 
  companyTableColumns, deleteCompanyButton, insertCompanyForm} from 'utils';

import Layout from 'components/common/Layout';
import Tabs from 'components/common/Tabs';
import Tab from 'components/common/Tab';
import Table from 'components/common/Table';
import Toast from 'components/common/Toast';
import FormModal from 'components/common/FormModal';
import Card from 'components/common/Card';

import api from 'services/api';
import 'react-responsive-modal/styles.css';

let toastID = 1

const Mapping = () => {

  const userCompany = JSON.parse(localStorage.getItem('CIMBA_COMPANY'))

  const [toastInfo, setToastInfo] = useState(false)
  const [toastList, setToastList] = useState([])
  
  const [companyModalVisible, setCompanyModalVisible] = useState(false)
  const [companyDataLoading, setCompanyDataLoading] = useState(false)
  const [companyData, setCompanyData] = useState([])

  const [itemData, setItemData] = useState([])
  const [itemDataLoading, setItemDataLoading] = useState(false)
  const [itemModalVisible, setItemModalVisible] = useState(false)

  const [companyNames, setCompanyNames] = useState({})

  const fetchItemData = () => {
    if (userCompany && userCompany.id) {
      setItemDataLoading(true)
      api.getItemMaps(userCompany.id,
        async (res) => {
          let error_flag = false
          if (res.status === 200) {
            for(let i = 0; i < res.data.length; i++) {
              let res_map = await api.getSingleCompanyMapAsync(userCompany.id, {map_ic_id: res.data[i].map_ic_id})
              if (res_map.status === 200) {
                res.data[i] = {
                  ...res.data[i],
                  map_company_jasmin_id: res_map.data.jasmin_id,
                }
              }
              else {
                error_flag = true
                break
              }
            }
          }
          else {
            error_flag = true
          }

          if (error_flag) {
            console.log(res)
            setItemData([])
            setItemDataLoading(false)
            addNewToast({
              id: toastID++,
              title: 'ERROR',
              description: `An error ocurred when fetching data. Please try again later.`,
              color: 'danger',
            })
          }
          else {
            setItemData(res.data)
            setItemDataLoading(false)
          }
      })
    }
  }

  const fetchCompanyData = async () => {
    if (userCompany && userCompany.id) {
      setCompanyDataLoading(true)
      api.getCompanyMaps(userCompany.id,
        async (res) => {
          let error_flag = false
          if (res.status === 200) {
            for(let i = 0; i < res.data.length; i++) {
              let res_comp = await api.getCompanyAsync(res.data[i].map_ic_id)
              if (res_comp.status === 200) {
                res.data[i] = {
                  ...res.data[i],
                  name: res_comp.data.name,
                }
              }
              else {
                error_flag = true
                break
              }
            }
          }
          else {
            error_flag = true
          }

          if (error_flag) {
            console.log(res)
            setCompanyData([])
            setCompanyDataLoading(false)
            addNewToast({
              id: toastID++,
              title: 'ERROR',
              description: `An error ocurred when fetching data. Please try again later.`,
              color: 'danger',
            })
          }
          else {
            setCompanyData(res.data)
            setCompanyDataLoading(false)
          }
      })
    }
  }

  const displayToasts = () => {
    if (toastInfo) {
      return (
        <Toast
          toastList={toastList}
        />
      );
    }
  }

  const addNewToast = newToastInfo => {
    setToastInfo(true)
    setToastList([
      ...toastList,
      newToastInfo
    ])
  }

  const deleteItemRow = (row, index) => {
    setItemDataLoading(true)
    api.deleteItemMap(userCompany.id, row.jasmin_id,
      (res) => {
        if (res.status === 200) {
          addNewToast({
            id: toastID++,
            title: 'Row Deleted',
            description: `The row was successfully deleted.`,
            color: 'info',
          })
          fetchItemData()
        }
        else {
          setItemDataLoading(false)
          addNewToast({
            id: toastID++,
            title: 'ERROR',
            description: `An error ocurred when deleting the row. Please try again later.`,
            color: 'danger',
          })
        }
      }
    )
  }

  const deleteCompanyRow = (row, index) => {
    setCompanyDataLoading(true)
    api.deleteCompanyMap(userCompany.id, row.jasmin_id,
      (res) => {
        if (res.status === 200) {
          addNewToast({
            id: toastID++,
            title: 'Row Deleted',
            description: `The row was successfully deleted.`,
            color: 'info',
          })
          fetchCompanyData()
        }
        else {
          setCompanyDataLoading(false)
          addNewToast({
            id: toastID++,
            title: 'ERROR',
            description: `An error ocurred when deleting the row. Please try again later.`,
            color: 'danger',
          })
        }
      }
    )
  }

  const insertItemAction = data => {
    setItemDataLoading(true)
    api.addItemMap(userCompany.id, data,
      (res) => {
        if (res.status === 201) {
          addNewToast({
            id: toastID++,
            title: 'Row Inserted',
            description: `The new row was successfully inserted.`,
            color: 'info',
          })
          fetchItemData()
        }
        else {
          setItemDataLoading(false)
          const errorMsg = res.data.error.response.data['type'] === 'validator' ? 
            'The data in the form was invalid or incomplete.'
            :
            res.data.error.response.data

          addNewToast({
            id: toastID++,
            title: 'ERROR',
            description: errorMsg,
            color: 'danger',
          })
        }
      })
  }
 
  const insertCompanyAction = data => {
    setCompanyDataLoading(true)
    api.addCompanyMap(userCompany.id, data,
      (res) => {
        if (res.status === 201) {
          addNewToast({
            id: toastID++,
            title: 'Row Inserted',
            description: `The new row was successfully inserted.`,
            color: 'info',
          })
          fetchCompanyData()
        }
        else {
          setCompanyDataLoading(false)
          const errorMsg = res.data.error.response.data['type'] === 'validator' ? 
            'The data in the form was invalid or incomplete.'
            :
            res.data.error.response.data

          addNewToast({
            id: toastID++,
            title: 'ERROR',
            description: errorMsg,
            color: 'danger',
          })
        }
      })
  }

  const openCompanyModal = () => {
    api.getCompanies(
      (res) => {
        if (res.status === 200) {
          const newCompanyNames = res.data.filter(elem => elem.id !== companyData.id).map(elem => {
            return {
              value: elem.id.toString(),
              label: elem.name,
            }
          })
          setCompanyNames(newCompanyNames)
          setCompanyModalVisible(true)
        }
        else {
          addNewToast({
            id: toastID++,
            title: 'ERROR',
            description: 'The was an error fetching data. Please try again later.',
            color: 'danger',
          })
        }
      }
    )
  }

  return (
    <>
      <Layout title='Mapping'>
        <Card>
          <Tabs>
            <Tab label="Items" switchfunc={fetchItemData} btntext="New Item Mapping" btnfunc={() => setItemModalVisible(true)}>
              <Table 
                loading={itemDataLoading}
                columns={itemTableColumns(deleteItemButton(deleteItemRow))} 
                data={itemData}
              />
            </Tab>
            <Tab label="Companies" switchfunc={fetchCompanyData} btntext="New Company Mapping" btnfunc={openCompanyModal}>
              <Table 
                loading={companyDataLoading}
                columns={companyTableColumns(deleteCompanyButton(deleteCompanyRow))} 
                data={companyData}
              />
            </Tab>
          </Tabs>
        </Card>
      </Layout>

      <FormModal 
        title={"Insert Item Mapping"}
        formfields={insertItemForm}
        open={itemModalVisible}
        closefunc={() => setItemModalVisible(false)}
        submitfunc={insertItemAction}
      />

      <FormModal 
        title={"Insert Company Mapping"}
        formfields={insertCompanyForm(companyNames)}
        open={companyModalVisible}
        closefunc={() => setCompanyModalVisible(false)}
        submitfunc={insertCompanyAction}
      />

      {displayToasts()}
    </>
  );
}

export default Mapping;
