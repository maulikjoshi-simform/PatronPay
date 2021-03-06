import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePaginationActions from "./TablePaginationActions";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";

import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";

import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHead";
import TablePagination from "@material-ui/core/TablePagination";
import EditUserModal from "../modals/EditUserModal";
import "../../App.css";
import ReactExport from "react-data-export";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import DatePicker from "../date/DatePicker";
import Dropdown from "../input/Dropdown";
import Button from "@material-ui/core/Button";
import { styles } from "./styles";
// import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteUsers } from "../../services/userApi";
import {
  deletePaymentProfiles,
  duplicatePaymentProfles,
  deleteProfileItems,
} from "../../services/profileApi";
import { withContext } from "../../store/WithContext";
import Snackbar from "@material-ui/core/Snackbar";
import ExportTransactions from "../modals/ExportTranactions";
import AddModal from "../modals/AddModal";
import ImportFile from "../modals/ImportFile";
import Stack from '@mui/material/Stack';
import PictureAsPdfOutlined from '@material-ui/icons/PictureAsPdfOutlined';
import DescriptionOutlined from '@material-ui/icons/DescriptionOutlined';
import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import { FormControlLabel } from "@material-ui/core";
import {Context} from "../../store/Context";
import { deleteUserAssignment } from "../../services/userAssignmentApi";
import UserAssignmentModal from "../modals/UserAssignmentModal";
// import EditModal from "../modals/EditModal";
// import EditCashPaymentModal from "../modals/EditCashPaymentModal";
// import EditMemberPaymentModal from "../modals/EditMemberPaymentModal";
// import EditCashlessPaymentModal from "../modals/EditCashlessPaymentModal";
import { deleteMembershipPayments } from "../../services/membershipPaymentApi";
import { deleteCashPayments } from "../../services/cashPaymentApi";
import { deleteCardPayments } from "../../services/cardPaymentApi";
import PaymentProfileModal from "../modals/PaymentProfileModal";
import FileCopy from '@material-ui/icons/FileCopy';
import { generateTransactionReceipt } from "../../services/transactionApi";
import AddOrganization from "../modals/AddOrgModal";
import ProfileItemCopyModal from "../modals/ProfileItemCopyModal";


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class EnhancedTable extends React.Component {
  constructor(props, context) {
    super();

    this.state = {
      open: false,
      order: "asc",
      orderBy: "calories",
      selected: [],
      renderer: [],
      datacopy: [],
      updatedCol: [],
      columnDataCopy: [],
      startDateData: [],
      // transactionHeader: [
      //   { label: "Date/time", key: "newDate" },
      //   { label: "Payment Url", key: "payment_url" },
      //   { label: "Transaction type", key: "trs_type" },
      //   { label: "Settled", key: "settled" },
      //   { label: "No of Items", key: "noOfItems" },
      // ],
      // profileItemsHeader: [
      //   { label: "Barcode", key: "barcode" },
      //   { label: "Description", key: "description" },
      //   { label: "Short Name", key: "short_name" },
      //   { label: "Price", key: "price" },
      // ],
      // paymentProfileHeader: [
      //   { label: "Configuration Type", key: "config_type" },
      //   { label: "Name", key: "name" },
      // ],
      // memberPaymentsHeader: [
      //   { label: "Amount", key: "amount" },
      //   { label: "Card number", key: "card_number" },
      //   { label: "Currency", key: "currency" },
      //   { label: "Name", key: "first_name" },
      //   { label: "Tip", key: "tip" },
      //   { label: "Tax", key: "tax" },
      //   { label: "Tip Tax", key: "tip_tax" },
      //   { label: "Transaction Type", key: "txn_type" },
      // ],
      // cashPaymentsHeader: [
      //   { label: "Amount", key: "amount" },
      //   { label: "Currency", key: "currency" },
      //   { label: "Tip", key: "tip" },
      //   { label: "Tax", key: "tax" },
      //   { label: "Tip Tax", key: "tip_tax" },
      //   { label: "Transaction Type", key: "txn_type" },
      // ],
      // cashlessPaymentsHeader: [
      //   { label: "Amount", key: "amount_auth" },
      //   { label: "Card type", key: "card_type" },
      //   { label: "Currency", key: "currency" },
      //   { label: "Name", key: "first_name" },
      //   { label: "Tip", key: "tip" },
      //   { label: "Tax", key: "tax" },
      //   { label: "Tip Tax", key: "tip_tax" },
      //   { label: "Transaction Type", key: "txn_type" },
      // ],
      // users: [
      //   { label: "Email", key: "email" },
      //   { label: "First Name", key: "first_name" },
      //   { label: "Last Name", key: "last_name" },
      // ],
      snackbar: false,
      vertical: "top",
      horizontal: "center",
      snackMsg: "",
      columnData: [],
      page: 0,
      rowsPerPage: 6,
      amount_auth_total: 0,
      tip_total: 0,
      tip_tax_total: 0,
      amount_total: 0,
      active: false,
      inactive: false,
      shoppingcart: false,
      quickpay: false
    };
  }
  static contextType = Context;

  onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (this.state.columnDataCopy.length > 0) {
      const columnData = reorder(
        this.state.columnDataCopy,
        result.source.index,
        result.destination.index
      );
  
      this.setState({
        columnDataCopy: columnData,
      });

      // if (this.props.name === "Transaction") {
      //   localStorage.setItem("Tcols", JSON.stringify(this.state.columnDataCopy));
      // } else if (this.props.name === "Payment Profiles") {
      //   localStorage.setItem("Pcols", JSON.stringify(this.state.columnDataCopy));
      // } else if (this.props.name === "Membership Payments") {
      //   localStorage.setItem("MemCols", JSON.stringify(this.state.columnDataCopy));
      // } else if (this.props.name === "Cashless Payments") {
      //   localStorage.setItem(
      //     "CashlessCols",
      //     JSON.stringify(this.state.columnDataCopy)
      //   );
      // } else localStorage.setItem("Cols", JSON.stringify(this.state.columnDataCopy));

    } else {
    const columnData = reorder(
      this.state.columnData,
      result.source.index,
      result.destination.index
    );

    this.setState({
      columnData: columnData,
    });
    // if (this.props.name === "Transaction") {
    //   localStorage.setItem("Tcols", JSON.stringify(this.state.columnData));
    // } else if (this.props.name === "Payment Profiles") {
    //   localStorage.setItem("Pcols", JSON.stringify(this.state.columnData));
    // } else if (this.props.name === "Membership Payments") {
    //   localStorage.setItem("MemCols", JSON.stringify(this.state.columnData));
    // } else if (this.props.name === "Cashless Payments") {
    //   localStorage.setItem(
    //     "CashlessCols",
    //     JSON.stringify(this.state.columnData)
    //   );
    // } else localStorage.setItem("Cols", JSON.stringify(this.state.columnData));
  }
  };
  handleWidthChange = (columnId, width) => {
    this.setState((state) => {
      const currentColumns = state.columnData;
      const currentColumnIndex = currentColumns.findIndex((column) => {
        return column.id === columnId;
      });
      const columnToChange = currentColumns[currentColumnIndex];
      const changedColumn = { ...columnToChange, width };
      currentColumns.splice(currentColumnIndex, 1, changedColumn);
      const newState = {
        columnData: currentColumns,
      };
      return newState;
    });
  };

  handleArrayMove = (from, to, oldData) => {
    const newData = [].concat(oldData);
    from >= to
      ? newData.splice(to, 0, newData.splice(from, 1)[0])
      : newData.splice(to - 1, 0, newData.splice(from, 1)[0]);

    return newData;
  };

  handleReorderColumn = (from, to) => {
    this.setState((state) => {
      return {
        columnData: this.handleArrayMove(from, to, state.columnData),
        data: this.handleArrayMove(from, to, state.data),
      };
    });
  };

  // material-ui code
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    const data =
      order === "desc"
        ? this.props.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.props.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.props.data.map((n) => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  componentDidMount() {
    // const columnData = localStorage.getItem("Cols");
    // const tableColdata = localStorage.getItem("Tcols");
    // const profileColData = localStorage.getItem("Pcols");
    // const memberCols = localStorage.getItem("MemCols");
    // const cashlessCols = localStorage.getItem("CashlessCols");
    // this.setState(
    //   {
    //     dataCopy: this.props.data,
    //     renderer: this.props.data,
    //     ...(columnData && { columnData: JSON.parse(columnData) }),
    //     columnData:
    //       this.props.name === "Profile Items"
    //         ? columnData
    //           ? JSON.parse(columnData)
    //           : this.props.columnData
    //         : this.props.name === "Payment Profiles"
    //         ? profileColData
    //           ? JSON.parse(profileColData)
    //           : this.props.columnData
    //         : this.props.name === "Membership Payments"
    //         ? memberCols
    //           ? JSON.parse(memberCols)
    //           : this.props.columnData
    //         : this.props.name === "CashLess Payments"
    //         ? cashlessCols
    //           ? JSON.parse(cashlessCols)
    //           : this.props.columnData
    //         : tableColdata
    //         ? JSON.parse(tableColdata)
    //         : this.props.columnData,
    //   },
    //   () => {}
    // );
    if(this.state.columnDataCopy.length > 0) {
      this.setState({
        dataCopy: this.props.dataCopy,
        renderer: this.props.data,
        columnData: this.state.columnDataCopy
      })
    } else {
    this.setState({
      dataCopy: this.props.dataCopy,
      renderer: this.props.data,
      columnData: this.props.columnData
    })
  }
    const reduceAmountData = this.props?.data?.map((rd) => rd.amount);
    const reduceAmountAuthData = this.props?.data?.map((rd) => rd.amount_auth);
    const reduceTipData = this.props?.data.map((rt) => rt.tip);
    const reduceTipTaxTotal = this.props?.data.map((rtt) => rtt.tip_tax);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const ReduceData =
      reduceAmountData.length > 0 && reduceAmountData.reduce(reducer);
    const ReduceTipData =
      reduceTipData.length > 0 && reduceTipData.reduce(reducer);
    const ReduceAmountAuth =
      reduceAmountAuthData.length > 0 && reduceAmountAuthData.reduce(reducer);
    const ReduceTipTaxData =
      reduceTipTaxTotal.length > 0 && reduceTipTaxTotal.reduce(reducer);
    this.setState({
      amount_total: ReduceData,
      amount_auth_total: ReduceAmountAuth,
      tip_total: ReduceTipData,
      tip_tax_total: ReduceTipTaxData,
    });
  }

  searchedFunc = (input) => {
    if (input.length > 0) {
      this.setState({
        renderer: input,
      });
    } else {
      this.setState({
        renderer: this.state.dataCopy,
      });
    }
  };

  exportCSV = () => {
    const columnDatas = this.state.columnDataCopy.length > 0 ? this.state.columnDataCopy.map(i => Object.values(i)) : this.state.columnData.map(i => Object.values(i))
    let headers = columnDatas.map(i => i[3])
    let tempheaderkey = columnDatas.map(i => i[0])
    
    let data = [headers]
    this.props.data.forEach((ele) => {
      const obj = []
      tempheaderkey.forEach(key => {
        if(key === "newIcon"){
          obj.push("")
        } else {
          obj.push(ele[key])
        }
      })
      data.push(obj)
    })
    return data;
  }

  exportPDF = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    let title = this.props.name
    const columnDatas = this.state.columnDataCopy.length > 0 ? this.state.columnDataCopy.map(i => Object.values(i)) : this.state.columnData.map(i => Object.values(i))
    const headers = [columnDatas.map(i => i[3])]
    const tempheaderkey = columnDatas.map(i => i[0])

    let data = []
    this.props.data.forEach((ele) => {
      const obj = []
      tempheaderkey.forEach(key => {
        obj.push(ele[key]) 
      })
      data.push(obj)
    })

    let content = {
    startY: 50,
    head: headers,
    body: data,
    };
    // let title = "";
    // let content = {};
    // if (this.props.name === "Transaction") {
    //   title = "Transaction";
    //   const headers = [
    //     [
    //       "Date/time",
    //       "Payment Url",
    //       "Transaction type",
    //       "Settled",
    //       "No of Items",
    //     ],
    //   ];

    //   const data = this.props.data.map((elt) => [
    //     elt.newDate,
    //     elt.payment_url,
    //     elt.trs_type,
    //     elt.settled,
    //     elt.noOfItems,
    //   ]);

    //   content = {
    //     startY: 50,
    //     head: headers,
    //     body: data,
    //   };
    // } else if (this.props.name === "Profile Items") {
    //   title = "Profile Items";
    //   const headers = [["Barcode", "Description", "Short Name", "Price"]];

    //   const data = this.props.data.map((elt) => [
    //     elt.barcode,
    //     elt.description,
    //     elt.short_name,
    //     elt.price,
    //   ]);

    //   content = {
    //     startY: 50,
    //     head: headers,
    //     body: data,
    //   };
    // } else if (this.props.name === "Payment Profiles") {
    //   title = "Payment Profiles";
    //   const headers = [["Name", "Configuration Type"]];

    //   const data = this.props.data.map((elt) => [elt.name, elt.config_type]);

    //   content = {
    //     startY: 50,
    //     head: headers,
    //     body: data,
    //   };
    // } else if (this.props.name === "Membership Payments") {
    //   title = "Membership Payments";
    //   const headers = [
    //     [
    //       "Amount",
    //       "Card Number",
    //       "Curremcy",
    //       "Name",
    //       "Tip",
    //       "Tax",
    //       "Tip Tax",
    //       "Transaction Type",
    //     ],
    //   ];
    //   const data = this.props.data.map((elt) => [
    //     elt.amount,
    //     elt.card_number,
    //     elt.currency,
    //     elt.first_name,
    //     elt.tip,
    //     elt.tax,
    //     elt.tip_tax,
    //     elt.txn_type,
    //   ]);

    //   content = {
    //     startY: 50,
    //     head: headers,
    //     body: data,
    //   };
    // } else if (this.props.name === "Cash Payments") {
    //   const headers = [
    //     ["Amount", "Curremcy", "Tip", "Tax", "Tip Tax", "Transaction Type"],
    //   ];
    //   const data = this.props.data.map((elt) => [
    //     elt.amount,
    //     elt.currency,
    //     elt.tip,
    //     elt.tax,
    //     elt.tip_tax,
    //     elt.txn_type,
    //   ]);

    //   content = {
    //     startY: 50,
    //     head: headers,
    //     body: data,
    //   };
    // } else if (this.props.name === "Cashless Payments") {
    //   const headers = [
    //     [
    //       "Amount",
    //       "Card Type",
    //       "Currency",
    //       "Name",
    //       "Tip",
    //       "Tax",
    //       "Tip Tax",
    //       "Transaction Type",
    //     ],
    //   ];
    //   const data = this.props.data.map((elt) => [
    //     elt.amount_auth,
    //     elt.card_type,
    //     elt.currency,
    //     elt.first_name,
    //     elt.tip,
    //     elt.tax,
    //     elt.tip_tax,
    //     elt.txn_type,
    //   ]);

    //   content = {
    //     startY: 50,
    //     head: headers,
    //     body: data,
    //   };
    // } else if (this.props.name === "Users") {
    //   const headers = [["email", "first_name", "last_name"]];
    //   const data = this.props.data.map((elt) => [
    //     elt.email,
    //     elt.first_name,
    //     elt.last_name,
    //   ]);

    //   content = {
    //     startY: 50,
    //     head: headers,
    //     body: data,
    //   };
    // }

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("report.pdf");
  };

  handleSelectDateFilter = (startDate,endDate) => {
    const sDate = startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate();
    const eDate = endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate();

    let filteredDates = this.props.data.filter((fd) => {
      let fddate = new Date(fd.date_created)
      let fdDate_created = (fddate).getFullYear()+"-"+((fddate).getMonth()+1)+"-"+(fddate).getDate();

      return (fdDate_created >= sDate && fdDate_created <= eDate);
    });
    this.setState({
      renderer: filteredDates,
    });
  }

  // setStartDate = (date) => {
  //   // let createdDate = this.props.data.map((i) => {
  //   //   return {
  //   //     date: new Date(i.date_created).getDate(),
  //   //     id: i.id,
  //   //     url: i.payment_url,
  //   //     type: i.trs_type,
  //   //   };
  //   // });

  //   let filteredDates = this.props.data.filter((fd) => {
  //     // return fd.date_created < date.getDate();
  //     return new Date(fd.date_created).toISOString() > new Date(date).toISOString();
  //   });
  //   this.setState({
  //     renderer: filteredDates,
  //     startDateData: filteredDates,
  //   });
  // };

  // setEndDate = (date) => {
  //   // let endDate = this.props.data.map((j) => {
  //   //   return {
  //   //     date: new Date(j.date_modified).getDate(),
  //   //     id: j.id,
  //   //     url: j.payment_url,
  //   //     type: j.trs_type,
  //   //   };
  //   // });

  //   let filteredDates = this.state.startDateData.filter((fd) => {
  //     // return fd.date_modified > date.getDate();
  //     return new Date(fd.date_modified).toISOString() < new Date(date).toISOString();
  //   });
  //   this.setState({
  //     renderer: filteredDates,
  //   });
  // };

  selectedData = (data) => {
    const filLogs = [];
    data?.forEach((element) => {
      const a = this.state.columnData.filter((j) => (j.label === element));
      filLogs.push(...a);
    });
    if (filLogs.length > 0) {
      this.setState({
        columnDataCopy: filLogs,
        // columnData: filLogs,
      });
    }
  };

  columnRender = () => {
    if (this.state.columnDataCopy.length > 0) {
      return this.state.columnDataCopy;
    } else if (this.props.name === "Transaction") {
      return this.state.columnData;
    } else {
      return this.state.columnData;
    }
  };

  // setMemEndDate = (date) => {
  //   // const endDate = this.props.data.map((sd) => {
  //   //   return {
  //   //     date: new Date(sd.date_created).getDate(),
  //   //     amount: sd.amount,
  //   //     card_number: sd.card_number,
  //   //     first_name: sd.first_name,
  //   //     last_name: sd.last_name,
  //   //     tip: sd.tip,
  //   //     tip_tax: sd.tip_tax,
  //   //     txn_type: sd.txn_type,
  //   //   };
  //   // });
  //   let filteredDates = this.state.startDateData.filter((fd) => {
  //     // return fd.date_created > date.getDate();
  //     return new Date(fd.date_created).toISOString() < new Date(date).toISOString();
  //   });
  //   this.setState({
  //     renderer: filteredDates,
  //   });
  // };

  // setMemStartDate = (date) => {
  //   // const startDate = this.props.data.map((sd) => {
  //   //   return {
  //   //     date: new Date(sd.date_modified).getDate(),
  //   //     amount: sd.amount,
  //   //     card_number: sd.card_number,
  //   //     first_name: sd.first_name,
  //   //     last_name: sd.last_name,
  //   //     tip: sd.tip,
  //   //     tip_tax: sd.tip_tax,
  //   //     txn_type: sd.txn_type,
  //   //   };
  //   // });
  //   let filteredDates = this.props.data.filter((fd) => {
  //     // return fd.date_modified > date.getDate();
  //     return new Date(fd.date_modified).toISOString() > new Date(date).toISOString();
  //   });
  //   this.setState({
  //     renderer: filteredDates,
  //     startDateData: filteredDates,
  //   });
  // };

  // setCashlessStartDate = (date) => {
  //   // const startDate = this.props.data.map((sd) => {
  //   //   return {
  //   //     date: new Date(sd.date_modified).getDate(),
  //   //     amount_auth: sd.amount_auth,
  //   //     card_type: sd.card_type,
  //   //     cc_last4: sd.cc_last4,
  //   //     currency: sd.currency,
  //   //     tip: sd.tip,
  //   //     tip_tax: sd.tip_tax,
  //   //     txn_type: sd.txn_type,
  //   //   };
  //   // });
  //   let filteredDates = this.props.data.filter((fd) => {
  //     // return fd.date_modified > date.getDate();
  //     return new Date(fd.date_created).toISOString() > new Date(date).toISOString();
  //   });
  //   this.setState({
  //     renderer: filteredDates,
  //     startDateData: filteredDates,
  //   });
  // };

  // setCashlessEndDate = (date) => {
  //   // const startDate = this.props.data.map((sd) => {
  //   //   return {
  //   //     date: new Date(sd.date_created).getDate(),
  //   //     amount_auth: sd.amount_auth,
  //   //     card_type: sd.card_type,
  //   //     cc_last4: sd.cc_last4,
  //   //     currency: sd.currency,
  //   //     tip: sd.tip,
  //   //     tip_tax: sd.tip_tax,
  //   //     txn_type: sd.txn_type,
  //   //   };
  //   // });
  //   let filteredDates = this.state.startDateData.filter((fd) => {
  //     // return fd.date_created > date.getDate();
  //     return new Date(fd.date_created).toISOString() < new Date(date).toISOString();
  //   });
  //   this.setState({
  //     renderer: filteredDates,
  //   });
  // };

  // setCashStartDate = (date) => {
  //   // const startDate = this.props.data.map((sd) => {
  //   //   return {
  //   //     date: new Date(sd.date_created).getDate(),
  //   //     amount: sd.amount,
  //   //     currency: sd.currency,
  //   //     tip: sd.tip,
  //   //     tip_tax: sd.tip_tax,
  //   //     txn_type: sd.txn_type,
  //   //   };
  //   // });
  //   let filteredDates = this.props.data.filter((fd) => {
  //     // return fd.date_created > date.getDate();
  //     return new Date(fd.date_created).toISOString() > new Date(date).toISOString();
  //   });
  //   this.setState({
  //     renderer: filteredDates,
  //     startDateData: filteredDates,
  //   });
  // };

  // setCashEndDate = (date) => {
  //   // const startDate = this.props.data.map((sd) => {
  //   //   return {
  //   //     date: new Date(sd.date_modified).getDate(),
  //   //     amount: sd.amount,
  //   //     currency: sd.currency,
  //   //     tip: sd.tip,
  //   //     tip_tax: sd.tip_tax,
  //   //     txn_type: sd.txn_type,
  //   //   };
  //   // });
  //   let filteredDates = this.state.startDateData.filter((fd) => {
  //     // return fd.date_modified > date.getDate();
  //     return new Date(fd.date_modified).toISOString() < new Date(date).toISOString();

  //   });
  //   this.setState({
  //     renderer: filteredDates,
  //   });
  // };

  handleDelete = (row) => {
    deleteUsers(row.id).then(() =>
          this.setState({
            snackbar: true,
            snackMsg: "User Deleted Succesfully",
          })
        )
        .catch(() =>
          this.setState({ snackbar: true, snackMsg: "Could Delete User" })
        )
  };

  handlePaymentProfileDelete = (row) => {
    deletePaymentProfiles(row.id).then(() =>
          this.setState({
            snackbar: true,
            snackMsg: "Payment Profile Deleted Succesfully",
          })
        )
        .catch(() =>
          this.setState({
            snackbar: true,
            snackMsg: "Could not Delete Payment Profile",
          })
        )
  };

  handleUserAssignmentDelete = (row) => {
    deleteUserAssignment(row.id).then(() =>  
      this.setState({ 
        snackbar: true,
        snackMsg: "User Assignment Deleted Successfully",
      })
    )
    .catch(() => 
      this.setState({
        snackbar: true,
        snackMsg: "Could not Delete User Assignment",
      })
      )
  }

  handleMemberPaymentDelete = (row) => {
    deleteMembershipPayments(row.id).then(() => 
      this.setState({
        snackbar: true,
        snackMsg: "Deleted Succesfully"
      })
      )
      .catch(() =>
        this.setState({
          snackbar: true,
          snackMsg: "Could not Delete"
        })
        )
  }

  handleCashPaymentDelete = (row) => {
    deleteCashPayments(row.id).then(() => 
      this.setState({
        snackbar: true,
        snackMsg: "Deleted Succesfully"
      })
      )
      .catch(() =>
        this.setState({
          snackbar: true,
          snackMsg: "Could not Delete"
        })
        )
  }

  handleCashlessPaymentDelete = (row) => {
    deleteCardPayments(row.id).then(() =>
      this.setState({
        snackbar: true,
        snackMsg: "Deleted Succesfully"
      })
      )
      .catch(() =>
        this.setState({
          snackbar: true,
          snackMsg: "Could not Delete"
        })
        )
  }

  handleCopyPaymentProfiles = (row) => {
    let name  = prompt("Enter name for new profile:")
    if(name){
      const payload = {"pk": row.id, "profile_name": name}
      duplicatePaymentProfles(payload).then(() =>
        this.setState({
          snackbar: true,
          snackMsg: "Duplicate Payment Profile Created Succesfully",
        })
      )
      .catch(() =>
        this.setState({
          snackbar: true,
          snackMsg: "Payment Profile Not Created",
        })
      )
    }
  }

  handleProfileItemDelete =(row) => {
    deleteProfileItems(row.id).then(() =>
      {this.setState({
        snackbar: true,
        snackMsg: "Deleted Succesfully"
      });
    }
      )
      .catch(() =>
        this.setState({
          snackbar: true,
          snackMsg: "Could not Delete"
        })
        )
  }

  handleGenerateReceipt = (row) => {
    const payload = { "trs_id": row.trs_id}
    generateTransactionReceipt(payload).then((res) =>
      // {
      //   this.setState({
      //   snackbar: true,
      //   snackMsg: "Receipt Generate Successfully",
      //   });
        {window.open(res.data.data, "_blank")}
      // }
    )
  .catch(() =>
    this.setState({
      snackbar: true,
      snackMsg: "Unable to Generate Receipt",
    })
  )
  }

  handleClose = () => {
    this.setState({ snackbar: false });
  };

  handlechecked = (event, name) => {
    this.setState({active: false,inactive: false, shoppingcart: false, quickpay: false});
    let newData = []
    if(name==="active" && event.target.checked){
      newData = this.props.data.filter((temp) => temp.is_deleted === "Yes")
      this.setState({active: event.target.checked, renderer: newData})
    }else if(name==="inactive" && event.target.checked){
      newData = this.props.data.filter((temp) => temp.is_deleted === "No")
      this.setState({inactive: event.target.checked, renderer: newData})
    }
    // else if(name==="shopping" && event.target.checked){
    //   newData = this.props.data.filter((temp) => temp.paymentProfile === "Shopping Cart Profile")
    //   this.setState({shoppingcart: event.target.checked, renderer: newData})
    // }else if(name==="quickpay" && event.target.checked){
    //   newData = this.props.data.filter((temp) => temp.paymentProfile === "QuickPay Profile")
    //   this.setState({quickpay: event.target.checked, renderer: newData})
    // }
    else {
      // newData = this.props.data.filter((temp) => temp.is_deleted === false)
      this.setState({renderer: this.props.data})
    }
  }

  // handleAmountTotal = () => {
  //   const reducer = (accumulator, currentValue) => accumulator + currentValue;
  //   if(this.props.name === "Cashless Payments"){
  //     const reduceAmountAuthData = this.props?.data?.map((rd) => rd.amount_auth);
  //     const ReduceAmountAuth =
  //     reduceAmountAuthData.length > 0 && reduceAmountAuthData.reduce(reducer);

  //     return ReduceAmountAuth;
  //   } else {
  //     const reduceAmountData = this.props?.data?.map((rd) => rd.amount);
  //     const ReduceData =
  //       reduceAmountData.length > 0 && reduceAmountData.reduce(reducer);

  //     return ReduceData;
  //   }
  // }

  // handleTipTotal = () => {
  //   const reduceTipData = this.props?.data.map((rt) => rt.tip);
  //   const reducer = (accumulator, currentValue) => accumulator + currentValue;
  //   const ReduceTipData =
  //     reduceTipData.length > 0 && reduceTipData.reduce(reducer);

  //   return ReduceTipData;
  // }

  // handleTipTaxTotal = () => {
  //   const reduceTipTaxTotal = this.props?.data.map((rtt) => rtt.tip_tax);
  //   const reducer = (accumulator, currentValue) => accumulator + currentValue;
  //   const ReduceTipTaxData =
  //     reduceTipTaxTotal.length > 0 && reduceTipTaxTotal.reduce(reducer);

  //   return ReduceTipTaxData;
  // }

  render() {
    const columnLength = this.state.columnDataCopy.length > 0 ? this.state.columnDataCopy.length : this.state.columnData.length;
    const { classes, data, name, profile } = this.props;
    // const activeData = data?.filter((temp) => temp?.is_deleted === false)
    // const inactiveData = data?.filter((temp) => temp?.is_deleted === true)
    // const shoppingCart = data?.filter(temp => temp?.paymentProfile === "Shopping Cart Profile")
    // const quickPay = data?.filter(temp => temp?.paymentProfile === "QuickPay Profile")
    // const wgsmBaseball = data?.filter(temp => temp?.paymentProfile === "WGSM Baseball Profile")
    const {
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      renderer,
      amount_auth_total,
      amount_total,
      tip_total,
      tip_tax_total,
      vertical,
      horizontal,
      snackbar,
      snackMsg,
      active,
      inactive,
      // shoppingcart,
      // quickpay
    } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data?.length - page * rowsPerPage);
    return (
      <Paper className="searchBox">
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={snackbar}
          onClose={this.handleClose}
          message={snackMsg}
          key={vertical + horizontal}
        />
        <EnhancedTableToolbar
          title={name}
          numSelected={selected.length}
          items={data}
          searchedData={this.searchedFunc}
          profile={profile}
        >
        <div className="pDownloads">
          {name === "Transction" ? <ExportTransactions data={data} /> : null}
          {/* <span className="btnMargin"> */}
          <Stack direction="row" className="pDownloads__wrap" spacing={2} alignItems="center" justifyContent="flex-end">
            {name === "Profile Items" ? (
              <>
                <ImportFile />
                <CSVLink
                  data={this.props.data}
                  // headers={this.state.profileItemsHeader}
                  >
                  <Button 
                  variant="outlined"
                  size="large"
                  color="primary"
                  startIcon={<CloudUploadOutlined />}>Export All</Button>
                </CSVLink>
              </>
            ) : null}
            {/* </span> */}
            {/* <ExcelFile
              element={<Button variant="outlined" color="primary" size="large" startIcon={<DescriptionOutlined />}>Excel</Button>}
            >
              {name === "Transction" ? (
                <ExcelSheet data={this.props.data} name="Transction">
                  <ExcelColumn label="Date/time" value="newDate" />
                  <ExcelColumn label="Payment Url" value="payment_url" />
                  <ExcelColumn label="Transaction type" value="trs_type" />
                  <ExcelColumn label="Settled" value="settled" />
                  <ExcelColumn label="No of Items" value="noOfItems" />
                </ExcelSheet>
              ) : name === "Profile Items" ? (
                <ExcelSheet data={this.props.data} name="Profile Items">
                  <ExcelColumn label="Barcode" value="barcode" />
                  <ExcelColumn label="Description" value="description" />
                  <ExcelColumn label="Short Name" value="short_name" />
                  <ExcelColumn label="Price" value="price" />
                </ExcelSheet>
              ) : name === "Payment Profiles" ? (
                <ExcelSheet data={this.props.data} name="Payment Profile">
                  <ExcelColumn label="Name" value="name" />
                  <ExcelColumn
                    label="Configuration Type"
                    value="config_type"
                    />
                </ExcelSheet>
              ) : name === "Membership Payments" ? (
                <ExcelSheet data={this.props.data} name="Membership Payments">
                  <ExcelColumn label="Amount" value="amount" />
                  <ExcelColumn label="Card number" value="card_number" />
                  <ExcelColumn label="Currency" value="currency" />
                  <ExcelColumn label="Name" value="first_name" />
                  <ExcelColumn label="Tip" value="tip" />
                  <ExcelColumn label="Tax" value="tax" />
                  <ExcelColumn label="Tip Tax" value="tip_tax" />
                  <ExcelColumn label="Transaction Type" value="txn_type" />
                </ExcelSheet>
              ) : name === "Cash Payments" ? (
                <ExcelSheet data={this.props.data} name="Cash Payments">
                  <ExcelColumn label="Amount" value="amount" />
                  <ExcelColumn label="Currency" value="currency" />
                  <ExcelColumn label="Tip" value="tip" />
                  <ExcelColumn label="Tax" value="tax" />
                  <ExcelColumn label="Tip Tax" value="tip_tax" />
                  <ExcelColumn label="Transaction Type" value="txn_type" />
                </ExcelSheet>
              ) : name === "Cashless Payments" ? (
                <ExcelSheet data={this.props.data} name="Cashless Payments">
                  <ExcelColumn label="Amount" value="amount_auth" />
                  <ExcelColumn label="Card Type" value="card_type" />
                  <ExcelColumn label="Currency" value="currency" />
                  <ExcelColumn label="Name" value="first_name" />
                  <ExcelColumn label="Tip" value="tip" />
                  <ExcelColumn label="Tax" value="tax" />
                  <ExcelColumn label="Tip Tax" value="tip_tax" />
                  <ExcelColumn label="Transaction Type" value="txn_type" />
                </ExcelSheet>
              ) : name === "Users" ? (
                <ExcelSheet data={this.props.data} name="Users">
                  <ExcelColumn label="Email" value="email" />
                  <ExcelColumn label="First Name" value="first_name" />
                  <ExcelColumn label="Last Name" value="last_name" />
                </ExcelSheet>
              ) : null}
            </ExcelFile> */}
            {/* Without and condition dynamically download Excel file*/}
            <ExcelFile
              element={<Button variant="outlined" color="primary" size="large" startIcon={<DescriptionOutlined />}>Excel</Button>}
              >
              <ExcelSheet data={this.props.data} name={this.props.name}>
                {this.state.columnDataCopy.length > 0 
                  ? this.state.columnDataCopy?.map((columnData) => (
                    columnData.id !== "newIcon" ? <ExcelColumn label={columnData.label} value={columnData.id}/> : <ExcelColumn label={columnData.label} value="Icon"/>
                    ))
                  : this.state.columnData?.map((columnData) => (
                    columnData.id !== "newIcon" ? <ExcelColumn label={columnData.label} value={columnData.id}/> : <ExcelColumn label={columnData.label} value="Icon"/>
                ))
                }
              </ExcelSheet>
            </ExcelFile>
            <Button
              onClick={() => this.exportPDF()}
              variant="outlined"
              size="large"
              startIcon={<PictureAsPdfOutlined/>}
              color="primary"
            >
              Pdf
            </Button>
            {/* <span className="btnMargin"> */}
              {/* {name === "Transaction" ? (
                <CSVLink
                  data={this.props.data}
                  headers={this.state.transactionHeader}
                >
                  <Button 
                  variant="outlined"
                  size="large"
                  color="primary"
                  startIcon={<DescriptionOutlined />}
                  >
                    csv</Button>
                </CSVLink>
              ) : name === "Profile Items" ? (
                <CSVLink
                  data={this.props.data}
                  headers={this.state.profileItemsHeader}
                >
                  <Button 
                  variant="outlined"
                  size="large"
                  color="primary"
                  startIcon={<DescriptionOutlined />}
                  > csv</Button>
                </CSVLink>
              ) : name === "Payment Profiles" ? (
                <CSVLink
                  data={this.props.data}
                  headers={this.state.paymentProfileHeader}
                >
                  <Button 
                  variant="outlined"
                  size="large"
                  color="primary"
                  startIcon={<DescriptionOutlined />}
                  > csv</Button>
                </CSVLink>
              ) : name === "Membership Payments" ? (
                <CSVLink
                  data={this.props.data}
                  headers={this.state.memberPaymentsHeader}
                >
                  <Button 
                  variant="outlined"
                  size="large"
                  color="primary"
                  startIcon={<DescriptionOutlined />}
                  > csv</Button>
                </CSVLink>
              ) : name === "Cash Payments" ? (
                <CSVLink
                  data={this.props.data}
                  headers={this.state.cashPaymentsHeader}
                >
                  <Button 
                  variant="outlined"
                  size="large"
                  color="primary"
                  startIcon={<DescriptionOutlined />}
                  > csv</Button>
                </CSVLink>
              ) : name === "Cashless Payments" ? (
                <CSVLink
                  data={this.props.data}
                  headers={this.state.cashlessPaymentsHeader}
                >
                  <Button 
                  variant="outlined"
                  size="large"
                  color="primary"
                  startIcon={<DescriptionOutlined />}
                  > csv</Button>
                </CSVLink>
              ) : name === "Users" ? (
                <CSVLink data={this.props.data} headers={this.state.users}>
                  <Button 
                  variant="outlined"
                  size="large"
                  color="primary"
                  startIcon={<DescriptionOutlined />}
                  > csv</Button>
                </CSVLink>
              ) : null} */}
              <CSVLink data={this.exportCSV()}>
                  <Button 
                  variant="outlined"
                  size="large"
                  color="primary"
                  startIcon={<DescriptionOutlined />}
                  > csv</Button>
                </CSVLink>
          {/* </span> */}
          </Stack>
        </div>
        </EnhancedTableToolbar>
        <div className="pFilterPanel">
        {/* {name === "Transaction" ? (
          <DatePicker
            setEndDate={this.setEndDate}
            setStartDate={this.setStartDate}
          />
        ) : name === "Membership Payments" ? (
          <DatePicker
            setEndDate={this.setMemEndDate}
            setStartDate={this.setMemStartDate}
          />
        ) : name === "Cashless Payments" ? (
          <DatePicker
            setEndDate={this.setCashlessEndDate}
            setStartDate={this.setCashlessStartDate}
          />
        ) : name === "Cash Payments" ? (
          <DatePicker
            setEndDate={this.setCashEndDate}
            setStartDate={this.setCashStartDate}
          />
        ) : null} */}
        { (name === "Transaction" ||
            name === "Membership Payments" ||
            name === "Cashless Payments" ||
            name === "Cash Payments" ||
            name === "Transaction Items") 
        ? <DatePicker
            setDateSelect={this.handleSelectDateFilter}
            setButtonFilter={this.handleSelectDateFilter}
          />
        : null }
          <div className="drpDwn drpDwn-responsive">
            <Dropdown
              data={this.props.columnData}
              selectedData={(data) => this.selectedData(data)}
              columnDataCopy={this.state.columnDataCopy.length > 0 ? this.state.columnDataCopy : this.state.columnData}
              pageName={name}
            />
          </div>
        </div>
        <hr className="dashedline" />
        {name === "Transaction" ||
        name === "Transaction Items" ||
        name === "Payment Profiles" ||
        name === "User Assignment" ||
        name === "Profile Items" ||
        name === "My Organization" ||
        name === "Debug Logs" ||
        name === "Users" ? null : (
          <>
          <div className="totals">
            {name === "Cashless Payments" ? (
              <div className="totals__item">Amount <span>{amount_auth_total}</span></div>
            ) : (
              <div className="totals__item">Amount Total <span>{amount_total}</span></div>
            )}
            <div className="totals__item">Tip <span>{tip_total}</span></div>
            <div className="totals__item">Tip Tax <span>{tip_tax_total}</span></div>
          </div>
          <hr className="dashedline" />
          </>
        )}
        {name === "Profile Items" && (
          <>
          <div className="pProfileStatus">
            <div className="pProfileStatus__item" >
            <FormControlLabel
              control={
                <Checkbox name="active" checked={active} onChange={(event) => this.handlechecked(event, "active")}/>
              }
              label="Active"
            />
            </div>
            <div className="pProfileStatus__item">
              <FormControlLabel
                control={
                  <Checkbox name="inactive" checked={inactive} onChange={(event) => this.handlechecked(event, "inactive")}/>
                }
                label="Inactive"
              />
            </div>
            {/* <div className="pProfileStatus__item">
              <FormControlLabel
                control={
                  <Checkbox name="shopping_cart" checked={shoppingcart} onChange={(event) => this.handlechecked(event, "shopping")}/>
                }
                label="Shopping Cart"
              />
            </div> */}
            {/* <div className="pProfileStatus__item">
              <FormControlLabel
                control={
                  <Checkbox name="quick_pay" checked={quickpay} onChange={(event) => this.handlechecked(event, "quickpay")}/>
                }
                label="Quick Pay"
              />
            </div> */}
          </div> 
          <hr className="dashedline" />
          </>
        )}
          {/* { name === "Transaction" && (
          <div className="totals">
            <div className="totals__item">Active <span>{activeData.length}</span></div>
            <div className="totals__item">Inactive <span>{inactiveData.length}</span></div>
            <div className="totals__item">Shopping Cart <span>{shoppingCart.length}</span></div>
            <div className="totals__item">Quick Pay <span>{quickPay.length}</span></div>
            <div className="totals__item">Total<span>{data.length}</span></div>
          </div>
          )} */}
          
        <div className={classes.tableWrapper}>
          <Table
            table-layout="fixed"
            className={`pTable ${columnLength > 1 ? '' : 'oneCellAdded'}`}
            aria-labelledby="tableTitle"
          >
            <TableHead>
              <TableRow>
                <TablePagination
                  // component="div"
                  count={this.props.data?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page",
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page",
                  }}
                  rowsPerPageOptions={[6, 12, 18]}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableHead>
            <EnhancedTableHead
              handleReorderColumnData={this.onDragEnd}
              handleResizeColumn={this.handleWidthChange}
              columnData={this.columnRender()}
              numSelected={selected?.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data?.length}
              name={name}
            />
            {data?.length > 0 ? (
              <TableBody>
                {renderer?.length
                  ? renderer
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((n) => {
                        const isSelected = this.isSelected(n.id);
                        return (
                          <TableRow
                            hover
                            // onClick={(event) => this.handleClick(event, n.id)}
                            // role="checkbox"
                            // aria-checked={isSelected}
                            tabIndex={-1}
                            key={n.id}
                            selected={isSelected}
                          >
                            {/* <td className="tableDir"> */}
                              {/* <Table className="table"> */}
                                {/* <TableBody> */}
                                  {/* <TableRow> */}
                                    <TableCell padding="checkbox">
                                      <Checkbox checked={isSelected}  onClick={(event) => this.handleClick(event, n.id)}/>
                                    </TableCell>
                                    {this.columnRender().map((column) => {
                                      return column.numeric ? (
                                        <>
                                          <TableCell
                                            key={column.id}
                                            padding="none"
                                            width={
                                              `${column.width}px` || "100px"
                                            }
                                            // numeric
                                          >
                                            <div
                                              width={
                                                `${column.width}px` || "100px"
                                              }
                                              className="tableWidth"
                                            >
                                              {n[column.id]}
                                            </div>
                                          </TableCell>
                                          {/* <TableCell><image src={n.icon} /></TableCell> */}
                                        </>
                                      ) : column.id !== "receipt" ? (
                                        <TableCell
                                          key={column.id}
                                          padding="none"
                                          width={`${column.width}px` || "100px"}
                                        >
                                          <div
                                            style={{
                                              width:
                                                `${column.width}px` || "100px",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              // wordBreak: "break-all",
                                              // wordWrap: "break-word"
                                            }}
                                          >
                                            {n[column.id]}
                                          </div>
                                        </TableCell>
                                      ) : (
                                        <TableCell
                                          key={column.id}
                                          padding="none"
                                          width={`${column.width}px` || "100px"}
                                        >
                                          <div
                                            style={{
                                              width:
                                                `${column.width}px` || "100px",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              // wordBreak: "break-all",
                                              // wordWrap: "break-word"
                                            }}
                                          >
                                            {n["receipt"] 
                                              ? <a href={n["receipt"]} target="_blank" rel="noreferrer">View Receipt</a>
                                              : <Button color="primary" variant="outlined" size="small" onClick={() => this.handleGenerateReceipt(n)}>Generate Receipt</Button> 
                                            }
                                          </div>
                                        </TableCell>
                                      );
                                    })}

                                      {/* Transaction  */}
                                    {/* { name === "Transaction" && (
                                      <TableCell padding="none" width={"100px"}>
                                        <div className="toolHead">
                                          <EditModal row={n} />
                                          <DeleteIcon/>
                                        </div>
                                      </TableCell>
                                    )} */}
                                    {/* Cash Payments */}
                                    { name === "Cash Payments" && (
                                      <TableCell padding="none" width={"100px"}>
                                        <div className="toolHead">
                                          {/* <EditCashPaymentModal row={n} /> */}
                                          <DeleteIcon onClick={() => this.handleCashPaymentDelete(n)}/>
                                        </div>
                                      </TableCell>
                                    )}
                                    {/* Cashless Payments */}
                                    { name === "Cashless Payments" && (
                                      <TableCell padding="none" width={"100px"}>
                                        <div className="toolHead">
                                          {/* <EditCashlessPaymentModal row={n} /> */}
                                          <DeleteIcon onClick={() => this.handleCashlessPaymentDelete(n)}/>
                                        </div>
                                      </TableCell>
                                    )}
                                    {/* Membership Payments */}
                                    { name === "Membership Payments" && (
                                      <TableCell padding="none" width={"100px"}>
                                        <div className="toolHead">
                                          {/* <EditMemberPaymentModal row={n} /> */}
                                          <DeleteIcon 
                                            onClick={() => this.handleMemberPaymentDelete(n)}
                                          />
                                        </div>
                                      </TableCell>
                                    )}
                                    {/* My Organisation */}
                                    { name === "My Organization" && (
                                      <TableCell padding="none" width={"100px"}>
                                        <div className="toolHead">
                                          <AddOrganization row={n} />
                                        </div>
                                      </TableCell>
                                    )}
                                      {name === "Users" ? (
	                                      <TableCell
                                          padding="none"
                                          width={"100px"}
                                        >
                                        <div className="toolHead">
                                          <EditUserModal row={n} />
                                          <DeleteIcon
                                            onClick={() => this.handleDelete(n)}
                                          />
                                        </div>
                                        </TableCell>
                                      ) : name === "Profile Items" ? (
                                        <TableCell
                                          padding="none"
                                          width={"100px"}
                                        >
                                        <div className="toolHead">
                                          <ProfileItemCopyModal row={n}/>
                                          <AddModal row={n} />
                                          <DeleteIcon onClick={() => this.handleProfileItemDelete(n)}/>
                                        </div>
                                        </TableCell>
                                      ) : name === "Payment Profiles" ? (
                                        <TableCell
                                          padding="none"
                                          width={"100px"}
                                        >
                                        <div className="toolHead">
                                          <FileCopy onClick={() => this.handleCopyPaymentProfiles(n)}/>
                                          <PaymentProfileModal row={n} />
                                        <DeleteIcon
                                          onClick={() =>
                                            this.handlePaymentProfileDelete(n)
                                          }
                                        />
                                        </div>
                                        </TableCell>
                                      ) : name === "User Assignment" ? (
                                        <TableCell
                                          padding="none"
                                          width={"100px"}
                                        >
                                        <div className="toolHead">
                                        <DeleteIcon
                                          onClick={() =>
                                            this.handleUserAssignmentDelete(n)
                                          }
                                        />
                                        </div>
                                        </TableCell>
                                      ) : 
                                      null}
                                    {/* </div> */}
                                  {/* </TableRow> */}
                                {/* </TableBody> */}
                              {/* </Table> */}
                            {/* </td> */}
                          </TableRow>
                        );
                      })
                  : data
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((n) => {
                        const isSelected = this.isSelected(n.id);
                        return (
                          <TableRow
                            hover
                            // onClick={(event) => this.handleClick(event, n.id)}
                            // role="checkbox"
                            // aria-checked={isSelected}
                            tabIndex={-1}
                            key={n.id}
                            selected={isSelected}
                          >
                            {/* <td className="tableDir"> */}
                              {/* <Table className="table"> */}
                                {/* <TableBody> */}
                                  {/* <TableRow> */}
                                    <TableCell padding="checkbox" width={"48px"}>
                                      <Checkbox checked={isSelected} onClick={(event) => this.handleClick(event, n.id)}/>
                                    </TableCell>
                                    {this.columnRender()?.map((column) => {
                                      return column.numeric ? (
                                        <TableCell
                                          key={column.id}
                                          padding="none"
                                          width={`${column.width}px` || "100px"}
                                          // numeric
                                        >
                                          <div
                                            width={
                                              `${column.width}px` || "100px"
                                            }
                                            className="tableWidth"
                                          >
                                            {n[column.id]}
                                          </div>
                                        </TableCell>
                                      ) : column.id !== "receipt" ? (
                                        <TableCell
                                          key={column.id}
                                          padding="none"
                                          width={`${column.width}px` || "100px"}
                                        >
                                          <div
                                            style={{
                                              width:
                                                `${column.width}px` || "100px",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              // wordBreak: "break-all",
                                              // wordWrap: "break-word"
                                            }}
                                          >
                                            {n[column.id]}
                                          </div>
                                        </TableCell>
                                      ) : (
                                        <TableCell
                                          key={column.id}
                                          padding="none"
                                          width={`${column.width}px` || "100px"}
                                        >
                                          <div
                                            style={{
                                              width:
                                                `${column.width}px` || "100px",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              // wordBreak: "break-all",
                                              // wordWrap: "break-word"
                                            }}
                                          >
                                            {n["receipt"] 
                                              ? <a href={n["receipt"]} target="_blank" rel="noreferrer">View Receipt</a>
                                              : <Button color="primary" variant="outlined" size="small" onClick={() => this.handleGenerateReceipt(n)}>Generate Receipt</Button> 
                                            }
                                          </div>
                                      </TableCell>
                                      );
                                    })}

                                    {/* Transaction */}
                                    {/* { name === "Transaction" && (
                                      <TableCell padding="none" width={"100px"}>
                                        <div className="toolHead">
                                          <EditModal row={n} />
                                          <DeleteIcon />
                                        </div>
                                      </TableCell>
                                    )} */}
                                    {/* Cash Payments */}
                                    { name === "Cash Payments" && (
                                      <TableCell padding="none" width={"100px"}>
                                        <div className="toolHead">
                                          {/* <EditCashPaymentModal row={n} /> */}
                                          <DeleteIcon 
                                            onClick={() => this.handleCashPaymentDelete(n)}
                                          />
                                        </div>
                                      </TableCell>
                                    )}
                                    {/* Cashless Payments */}
                                    { name === "Cashless Payments" && (
                                      <TableCell padding="none" width={"100px"}>
                                        <div className="toolHead">
                                          {/* <EditCashlessPaymentModal row={n} /> */}
                                          <DeleteIcon 
                                            onClick={() => this.handleCashlessPaymentDelete(n)}
                                          />
                                        </div>
                                      </TableCell>
                                    )}
                                    {/* Membership Payments */}
                                    { name === "Membership Payments" && (
                                      <TableCell padding="none" width={"100px"}>
                                        <div className="toolHead">
                                          {/* <EditMemberPaymentModal row={n} /> */}
                                          <DeleteIcon 
                                            onClick={() => this.handleMemberPaymentDelete(n)}
                                          />
                                        </div>
                                      </TableCell>
                                    )}
                                    {/* My Organisation */}
                                    { name === "My Organization" && (
                                      <TableCell padding="none" width={"100px"}>
                                        <div className="toolHead">
                                          <AddOrganization row={n} />
                                        </div>
                                      </TableCell>
                                    )}
                                    {name === "Users" ? (
                                      <TableCell
                                        padding="none"
                                        width={"100px"}
                                      >
                                      <div className="toolHead">
                                        {/* <CashlessTrans name="Cashless Transaction" data={data}/> */}
                                        <EditUserModal row={n} />
                                        <DeleteIcon
                                          onClick={() => this.handleDelete(n)}
                                        />
                                      </div>
                                      </TableCell>
                                    ) : name === "Profile Items" ? (
                                      <TableCell
                                        padding="none"
                                        width={"100px"}
                                      >
                                      <div className="toolHead">
                                        <ProfileItemCopyModal row={n}/>
                                        <AddModal row={n} />
                                        <DeleteIcon onClick={() => this.handleProfileItemDelete(n)}/>
                                      </div>
                                      </TableCell>
                                    ) : name === "Payment Profiles" ? (
                                      <TableCell
                                        padding="none"
                                        width={"100px"}
                                      >
                                      <div className="toolHead">
                                      <FileCopy onClick={() => this.handleCopyPaymentProfiles(n)}/>
                                      <PaymentProfileModal row={n} />
                                      <DeleteIcon
                                        onClick={() =>
                                          this.handlePaymentProfileDelete(n)
                                        }
                                      />
                                      </div>
                                      </TableCell>
                                    ) : name === "User Assignment" ? (
                                      <TableCell
                                        padding="none"
                                        width={"100px"}
                                      >
                                      <div className="toolHead">
                                      <UserAssignmentModal row={n}/>
                                      <DeleteIcon
                                        onClick={() =>
                                          this.handleUserAssignmentDelete(n)
                                        }
                                      />
                                      </div>
                                      </TableCell>
                                    ) : null}
                                  {/* </TableRow> */}
                                {/* </TableBody> */}
                              {/* </Table> */}
                            {/* </td> */}
                          </TableRow>
                        );
                      })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody>
                <TableCell
                  colSpan={"30"}
                >
                  <div className="spinner-inner">
                  <div className="spinner">
                    {/* <CircularProgress /> */}
                    <p>No Data Available in Table</p>
                  </div>
                  </div>
                  </TableCell>
              </TableBody>
            )}
          </Table>
        </div>
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withContext(withStyles(styles)(EnhancedTable));
