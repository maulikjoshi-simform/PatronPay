import React, { useState } from "react";
import Button from "@mui/material/Button";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@mui/material/Modal";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useFormik } from "formik";
import { addPaymentProfles, editPaymentProfiles } from "../../services/profileApi";
// import { Context } from "../../store/Context"
import { useStyles } from "./styles";
import { Constants } from "../DndTable/Constants";
import EditIcon from "@material-ui/icons/Edit";
import Stack from '@mui/material/Stack';
import ReportProblemRounded from '@material-ui/icons/ReportProblemRounded';

const MenuProps = {
  PaperProps: {
    style: {
      maxWidth: 250,
    },
  },
};

// const label = { inputProps: { "aria-label": "Checkbox demo" } };

function PaymentProfileModal({ row, names}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  // const [config, setConfig] = useState([]);
  const [tip1, setTip1] = useState(0);
  const [tip2, setTip2] = useState(0);
  const [tip3, setTip3] = useState(0);
  const [configType, setConfigType] = useState(row ? row?.config_type : "");
  const [defaulTip, setDefaultTip] = useState("");
  const [dbg, setDbg] = useState(2);
  const [dbgupl, setDbgupl] = useState("");
  const handleOpen = () => setOpen(true);
  // const [, dispatch] = useContext(Context);
  const handleClose = () => setOpen(false);

  const formik = useFormik({
    initialValues: {
      // description: row?.description || "",
      name: row?.name || "",
      config_type: row?.config_type || "",
      custom_payments: (row?.custom_payments === "Yes" ? true : false) || false,
      include_pricing_details: (row?.include_pricing_details === "Yes" ? true : false) || false,
      enable_tip: (row?.enable_tip === "Yes" ? true : false) || false,
      custom_payment_tax: row?.custom_payment_tax || 0,
      tip_tax: row?.tip_tax || 0,
      prompt_for_receipt: row?.prompt_for_receipt || false,
      ask_customer_name: row?.ask_customer_name || false,
      pay_by_account_number: row?.pay_by_account_number || false,
      require_first_name: row?.require_first_name ||false,
      require_last_name: row?.require_last_name ||false,
      is_deleted: row ? ((row?.is_deleted === "Yes" ? true : false) && true) : true,
      dbg_upl_log_lvl: row?.dbg_upl_log_lvl ||"",
      dbg_upl_scheme: row?.dbg_upl_scheme ||"",
    },
    onSubmit: (values) => {
      const newPcf = {
        ...values,
        config_type: configType,
        dbg_upl_log_lvl: dbg,
        dbg_upl_scheme: dbgupl,
        is_deleted: !(values.is_deleted),
        tip_choices: [
          {
            default: defaulTip === "TP1" ? true : false,
            tip_btn: tip1,
          },
          {
            default: defaulTip === "TP2" ? true : false,
            tip_btn: tip2,
          },
          {
            default: defaulTip === "TP3" ? true : false,
            tip_btn: tip3,
          },
        ],
      };
      if(names === Constants.ADD) {
        addPaymentProfles(newPcf).then(() => {
          window.location.reload()
          // alert("Sucessfull addition")
          setOpen(false)
      })
      .catch(() => alert("There is an error"));
    }else {
      editPaymentProfiles(row.id, newPcf).then(() => {
        window.location.reload()
        // alert("Sucessfull addition")
        setOpen(false)
    })
    .catch(() => alert("There is an error"));
    }
      // addPaymentProfles(newPcf)
      //   .then(() => {
      //    getPaymentProfiles().then((res) => dispatch({
      //      type: "PAYMENT_PROFILES",
      //      payload: res.data.data.results,
      //    }))
      //     alert("Sucessfull addition")
      //     setOpen(false)
      //   })
      //   .catch(() => alert("There is an error"));
    },
  });

  const handleChange = (event, identifier) => {
    if (identifier === "config_type") setConfigType(event.target.value);
    else if (identifier === "defaultTip") setDefaultTip(event.target.value);
    else if (identifier === "dbg") setDbg(event.target.value);
    else if (identifier === "dbgupl") setDbgupl(event.target.value);
  };

  const handleTipChange = (e, tipNo) => {
    if (tipNo === "1") setTip1(e.target.value);
    else if (tipNo === "2") setTip2(e.target.value);
    else setTip3(e.target.value);
  };

  // useEffect(() => {
  //   const newDataSource = state.paymentProfiles.map((temp) => {
  //     return temp.config_type
  //   });
  //     const uniqarray = [...new Set(newDataSource)];
  //     const final_result = uniqarray.filter((result) => result !== "");
  //     setConfig(final_result);
  // }, [state.paymentProfiles]);

  return (
    <div>
      <span type="button" onClick={handleOpen}>
        {names === Constants.ADD ? <AddIcon /> : <EditIcon />}
      </span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
         <div className="paper pModal">
          <div className="pModal__header">
            {names === Constants.ADD ? (
              <h2 id="transition-modal-title">Add New Payment Profile</h2>
            ) : (
              <h2 id="transition-modal-title">Edit Payment Profile</h2>
            )}
          </div>
          <div className="pModal__body">
          <form onSubmit={formik.handleSubmit}>
          <div className="pRow">
            <div className="pCol pCol--col6 pCol--col-md-12">
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="pCol pCol--col6 pCol--col-md-12">
              <FormControl>
                <InputLabel id="demo-simple-select-helper-label">
                  Profile Mode
                </InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  value={configType}
                  label="Profile Mode"
                  onChange={(event) => handleChange(event, "config_type")}
                  MenuProps={MenuProps}
                >
                    <MenuItem value={"ShoppingCart"}>{"ShoppingCart"}</MenuItem>
                    <MenuItem value={"QuickPay"}>{"QuickPay"}</MenuItem>
                </Select>
              </FormControl>
              </div>
            </div>
            <div className="pRow pRow--align">
            <div className="pCol pCol--col4 pCol--col-md-12">
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="custom_payments"
                    value={formik.values.custom_payments}
                    checked={formik.values.custom_payments}
                  />
                }
                label="Other Amounts"
              />
              </div>
              <div className="pCol pCol--col4 pCol--col-md-12">
              <TextField
                type="number"
                id="outlined-basic"
                label="Other Amount Tax"
                variant="outlined"
                name="custom_payment_tax"
                onChange={formik.handleChange}
                value={formik.values.custom_payment_tax}
                />
              </div>
              <div className="pCol pCol--col4 pCol--col-md-12">
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="include_pricing_details"
                    value={formik.values.include_pricing_details}
                    checked={formik.values.include_pricing_details}
                  />
                }
                label="Amount Details "
              />         
              </div>
            </div>
            {/* <div className="pRow">
              <div className="pCol pCol--col4 pCol--col-md-12">
              <TextField
                type="number"
                id="outlined-basic"
                label="Other $ Amount Tax %: "
                variant="outlined"
                name="custom_payment_tax"
                onChange={formik.handleChange}
                value={formik.values.custom_payment_tax}
                />
              </div>
            </div> */}
            <hr className="dashedline" />
            <div className="pRow pRow--align">
              <div className="pCol pCol--col4 pCol--col-md-12">
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={formik.handleChange}
                      name="enable_tip"
                      value={formik.values.enable_tip}
                      checked={formik.values.enable_tip}
                    />
                  }
                  label="Enable Tips"
                />
              </div>
              <div className="pCol pCol--col4 pCol--col-md-12">
              <TextField
                id="outlined-basic"
                label="Tip Button #1 (%)"
                variant="outlined"
                type="number"
                onChange={(e) => handleTipChange(e, "1")}
                value={tip1}
              />
              </div>
              <div className="pCol pCol--col4 pCol--col-md-12">
              <TextField
                id="outlined-basic"
                label="Tip Button #2 (%)"
                variant="outlined"
                type="number"
                onChange={(e) => handleTipChange(e, "2")}
                value={tip2}
              />
              </div>
            </div>
            <div className="pRow">
            <div className="pCol pCol--col4 pCol--col-md-12">
              <TextField
                  id="outlined-basic"
                  label="Tip Button #3 (%)"
                  variant="outlined"
                  type="number"
                  onChange={(e) => handleTipChange(e, "3")}
                  value={tip3}
                />
            </div>
            <div className="pCol pCol--col4 pCol--col-md-12">
              <FormControl>
                <InputLabel id="demo-simple-select-helper-label">
                  Default Tip
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={defaulTip}
                  label="Default Tip"
                  onChange={(event) => handleChange(event, "defaultTip")}
                  MenuProps={MenuProps}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="TP1">Tip Button #1</MenuItem>
                  <MenuItem value="TP2">Tip Button #2</MenuItem>
                  <MenuItem value="TP3">Tip Button #3</MenuItem>
                </Select>
              </FormControl>
              </div>
              <div className="pCol pCol--col4 pCol--col-md-12">
              <TextField
                id="outlined-basic"
                label="Tip Tax"
                variant="outlined"
                type="number"
                name="tip_tax"
                onChange={formik.handleChange}
                value={formik.values.tip_tax}
              />
            </div>
            </div>
            <hr className="dashedline" />
            <div className="pRow">
              {/* <div className="pCol pCol--col12"> */}
              <div className="pCol pCol--col4 pCol--col-md-12">
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="pay_by_account_number"
                    value={formik.values.pay_by_account_number}
                    checked={formik.values.pay_by_account_number}
                  />
                }
                label="Member Payments"
              />
              </div>
              <div className="pCol pCol--col4 pCol--col-md-12">
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="require_first_name"
                    value={formik.values.require_first_name}
                    checked={formik.values.require_first_name}
                  />
                }
                label="Require First Name"
              />
              </div>
              <div className="pCol pCol--col4 pCol--col-md-12">
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="require_last_name"
                    value={formik.values.require_last_name}
                    checked={formik.values.require_last_name}
                  />
                }
                label="Require Last Name"
              />
              </div>
              {/* </div> */}
            </div>
            <hr className="dashedline" />
            <div className="pRow">
              <div className="pCol pCol--col4 pCol--col-md-12">
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="prompt_for_receipt"
                    value={formik.values.prompt_for_receipt}
                    checked={formik.values.prompt_for_receipt}
                  />
                }
                label="Text Receipts"
              />
              </div>
              <div className="pCol pCol--col4 pCol--col-md-12">
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="ask_customer_name"
                    value={formik.values.ask_customer_name}
                    checked={formik.values.ask_customer_name}
                  />
                }
                label="Ask For Name"
              />
            </div>
            <div className="pCol pCol--col4 pCol--col-md-12"></div>
            </div>
            <hr className="dashedline" />
            {/* <h3>CLUB MEMBER PAYMENTS</h3> */}
            <div className="pRow">
              <div className="pCol pCol--col12">
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="is_deleted"
                    value={formik.values.is_deleted}
                    checked={formik.values.is_deleted}
                  />
                }
                label="Active"
              />
              </div>
            </div>
            <div className="pRow">
            <div className="pCol pCol--col6 pCol--col-md-12">
              <FormControl>
                <InputLabel id="demo-simple-select-helper-label">
                  Dbg upl log lvl:
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={dbg}
                  label="Dbg upl log lvl:"
                  onChange={(event) => handleChange(event, "dbg")}
                  MenuProps={MenuProps}
                >
                  <MenuItem value={3}>DEBUG</MenuItem>
                  <MenuItem value={6}>ERROR</MenuItem>
                  <MenuItem value={4}>INFO</MenuItem>
                  <MenuItem value={2}>VERBOSE</MenuItem>
                  <MenuItem value={5}>WARN</MenuItem>
                </Select>
              </FormControl>
              </div>
              <div className="pCol pCol--col6 pCol--col-md-12">
              <FormControl>
                <InputLabel id="demo-simple-select-helper-label">
                  Dbg upl scheme:
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={dbgupl}
                  label="Dbg upl scheme:"
                  onChange={(event) => handleChange(event, "dbgupl")}
                  MenuProps={MenuProps}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Hourly">Hourly</MenuItem>
                  <MenuItem value="EveryCommunication">
                    EveryCommunication
                  </MenuItem>
                </Select>
              </FormControl>
              </div>
            </div>
            <hr className="dashedline" />
            <div>
              <Stack direction="row" justifyContent="space-evenly" alignItems="center">
                <div>
                  <Stack direction="column" justifyContent="center" alignItems="center" style={{color: 'orange'}} spacing={0.5}>
                    <ReportProblemRounded />
                    <p>Tip</p>
                  </Stack>
                </div>
                <div>
                  <Stack direction="column" justifyContent="center" alignItems="baseline" spacing={0.5}>
                    <p>1. Click Submit and then "Items" to add Profile Items to this Payment Profile.</p>
                    <p>2. Go to User Assignment to add User(s) to this Payment Profile.</p>
                  </Stack>
                </div>
              </Stack>
            </div>
            <div className="profileSubmitBtn">
              <Button variant="contained" color="primary" size="large" type="submit">
                Submit
              </Button>
            </div>
          </form>
          </div>
        </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default PaymentProfileModal;
