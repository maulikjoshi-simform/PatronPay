import React, {useContext} from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import EditIcon from "@material-ui/icons/Edit";
// import Input from "../input/input";
// import Button from "../input/Button";
import AddIcon from "@material-ui/icons/Add";
import { useFormik } from "formik";
import "../../App.css";
import { useStyles } from "./styles";
import TextField from "@material-ui/core/TextField";
import { Context } from "../../store/Context";
import {Constants} from "../DndTable/Constants"
import Snackbar from '@material-ui/core/Snackbar';
import { Button } from "@mui/material";
import { getCardPayments, editCardPayments } from "../../services/cardPaymentApi"


function EditCashlessPaymentModal({ row, name }) {
  const classes = useStyles();
  const [snackState, setsnackState] = React.useState({
    vertical: 'top',
    horizontal: 'center',
  });
  const [snackMsg, setSnackMsg] = React.useState("")
  const { vertical, horizontal } = snackState;
  const [open, setOpen] = React.useState(false);
  const [, dispatch] = useContext(Context)
  const [snackbar, setSnackbar] = React.useState(false)

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackClose = () => {
    setsnackState({ ...snackState, open: false });
  };

  console.log("row",row);

  const formik = useFormik({
    initialValues: {
        txn_date_time: row?.txn_date_time || "",
        txn_result: row?.txn_result || "",
        txn_type: row?.txn_type || "",
        currency: row?.currency || "",
        amount_auth: row?.amount_auth || 0.0,
        first_name: row?.first_name || "",
        last_name: row?.last_name || "",
        cc_last4: row?.cc_last4 || "",
        card_type: row?.card_type || "",
        auth_number: row?.auth_number || "",
        ref_id1: row?.ref_id1 || "",
        ref_id2: row?.ref_id2 || "",
        tip: row?.tip || 0.0,
        tip_tax: row?.tip_tax || 0.0,
    },
    onSubmit: (values) => {
        editCardPayments(row.id, values).then(() => getCardPayments()
        .then((res) => dispatch({ type: "CARD_PAYMENTS", payload: res.data.data.results })))
        .catch(() => setSnackMsg("Cannot Update Card Payments"), setSnackbar(true))
        setSnackMsg("Successfully Updated")
        setSnackbar(true)
        setOpen(false);


    //  if(name === Constants.ADD) {
    //      addUsers(values).then(() => getUsers()
    //      .then((res) => dispatch({type: "USER_DATA", payload:res.data.data.results})))
    //      .catch(() => setSnackMsg("Cannot Create User"), setSnackbar(true))
    //      setSnackMsg("User Created Succesfully")
    //      setSnackbar(true)
    //      setOpen(false);
    //  }else {
    //      editUsers(row.id, values)
    //      .then(() => getUsers().then((res) => dispatch({type: "USER_DATA", payload:res.data.data.results})))
    //      .catch(() => setSnackMsg("Cannot Edit User"), setSnackbar(true))
    //      setSnackMsg("User Edited Succesfully")
    //      setSnackbar(true)
    //      setOpen(false);
    //  }
    },
  });
  return (
    <>
    <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbar}
        onClose={handleSnackClose}
        message={snackMsg}
        key={vertical + horizontal}
      />
      <span type="button" onClick={handleOpen}>
        {name ===  Constants.ADD ? <AddIcon /> : <EditIcon />}
      </span>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.editModal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className="paper pModal">
            <div className="pModal__header">
              {/* {name === Constants.ADD ? (
                <h2 id="transition-modal-title">Add Users</h2>
              ) : ( */}
                <h2 id="transition-modal-title">Edit Cashless Payments</h2>
              {/* )} */}
            </div>
            <div className="pModal__body">
              <form onSubmit={formik.handleSubmit}>
              <div className="pRow">
                <div className="pCol pCol--col12">
                  <TextField
                    id="outlined-basic"
                    name="txn_date_time"
                    type="text"
                    label="Txn Date Time"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.txn_date_time}
                    className="text"
                  />
                </div>
              </div>
            <div className="pRow">
                <div className="pCol pCol--col6 pCol--col-md-12">
                <TextField
                    lid="outlined-basic"
                    name="txn_result"
                    type="text"
                    label="Txn Result"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.txn_result}
                />
                </div>
                <div className="pCol pCol--col6 pCol--col-md-12">
                <TextField
                    id="outlined-basic"
                    name="txn_type"
                    type="text"
                    label="Txn Type"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.txn_type}
                />
                </div>
            </div>
            <div className="pRow">
                <div className="pCol pCol--col6 pCol--col-md-12">
                <TextField
                    lid="outlined-basic"
                    name="currency"
                    type="text"
                    label="Currency"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.currency}
                />
                </div>
                <div className="pCol pCol--col6 pCol--col-md-12">
                <TextField
                    id="outlined-basic"
                    name="amount_auth"
                    type="number"
                    label="Amount Auth"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.amount_auth}
                />
                </div>
            </div>
            <div className="pRow">
                <div className="pCol pCol--col6 pCol--col-md-12">
                <TextField
                    id="outlined-basic"
                    name="first_name"
                    type="text"
                    label="First Name"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.first_name}
                />
                </div>
                <div className="pCol pCol--col6 pCol--col-md-12">
                <TextField
                    lid="outlined-basic"
                    name="last_name"
                    type="text"
                    label="Last Name"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.last_name}
                />
                </div>
            </div>
            <div className="pRow">
                <div className="pCol pCol--col4 pCol--col-md-12">
                    <TextField
                    id="outlined-basic"
                    name="cc_last4"
                    type="text"
                    label="CC Last 4"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.cc_last4}
                    />
                </div>
                <div className="pCol pCol--col4 pCol--col-md-12">
                    <TextField
                    lid="outlined-basic"
                    name="card_type"
                    type="text"
                    label="Card Type"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.card_type}
                    />
                </div>
                <div className="pCol pCol--col4 pCol--col-md-12">
                    <TextField
                    lid="outlined-basic"
                    name="auth_number"
                    type="text"
                    label="Auth Number"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.auth_number}
                    />
                </div>
            </div>
            <div className="pRow">
                <div className="pCol pCol--col6 pCol--col-md-12">
                    <TextField
                    lid="outlined-basic"
                    name="ref_id1"
                    type="text"
                    label="Ref ID1"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.ref_id1}
                    />
                </div>
                <div className="pCol pCol--col6 pCol--col-md-12">
                    <TextField
                    lid="outlined-basic"
                    name="ref_id2"
                    type="text"
                    label="Ref ID2"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.ref_id2}
                    />
                </div>
            </div>
            <div className="pRow">
                <div className="pCol pCol--col6 pCol--col-md-12">
                    <TextField
                    lid="outlined-basic"
                    name="tip"
                    type="number"
                    label="Tip"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.tip}
                    />
                </div>
                <div className="pCol pCol--col6 pCol--col-md-12">
                    <TextField
                    lid="outlined-basic"
                    name="tip_tax"
                    type="number"
                    label="Tip Tax"
                    multiline
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.tip_tax}
                    />
                </div>
            </div>

                <div className="profileSubmitBtn">
                  {/* <button className="btn" type="submit">Submit</button> */}
                  <Button variant="contained" color="primary" size="large" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
}

export default React.memo(EditCashlessPaymentModal);
