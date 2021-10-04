import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
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
import { getConfigApi } from "../../services/orderApi";
import { addPaymentProfles, getPaymentProfiles } from "../../services/profileApi";
import { Context } from "../../store/Context"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// const label = { inputProps: { "aria-label": "Checkbox demo" } };

function PaymentProfileModal() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState([]);
  const [tip1, setTip1] = useState(0);
  const [tip2, setTip2] = useState(0);
  const [tip3, setTip3] = useState(0);
  const [name, setName] = useState("");
  const [defaulTip, setDefaultTip] = useState("");
  const [dbg, setDbg] = useState(0);
  const [dbgupl, setDbgupl] = useState("");
  const handleOpen = () => setOpen(true);
  const [state, dispatch] = useContext(Context);
  const handleClose = () => setOpen(false);

  const formik = useFormik({
    initialValues: {
      description: "",
      name: "",
      custom_payments: false,
      include_pricing_details: false,
      enable_tip: false,
      custom_payment_tax: 0,
      tip_tax: 0,
      prompt_for_receipt: false,
      ask_customer_name: false,
      pay_by_account_number: false,
      require_first_name: false,
      require_last_name: false,
      is_deleted: false,
      dbg_upl_log_lvl: "",
      dbg_upl_scheme: "",
    },
    onSubmit: (values) => {
      const newPcf = {
        ...values,
        name: name,
        dbg_upl_log_lvl: dbg,
        dbg_upl_scheme: dbgupl,
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
      console.log(state);
      addPaymentProfles(newPcf)
        .then(() => {
         getPaymentProfiles().then((res) => dispatch({
           type: "PAYMENT_PROFILES",
           payload: res.data.data.results,
         }))
          alert("Sucessfull addition")
          setOpen(false)
        })
        .catch(() => alert("There is an error"));
    },
  });

  const handleChange = (event, identifier) => {
    if (identifier === "name") setName(event.target.value);
    else if (identifier === "defaultTip") setDefaultTip(event.target.value);
    else if (identifier === "dbg") setDbg(event.target.value);
    else if (identifier === "dbgupl") setDbgupl(event.target.value);
  };

  const handleTipChange = (e, tipNo) => {
    if (tipNo === "1") setTip1(e.target.value);
    else if (tipNo === "2") setTip2(e.target.value);
    else setTip3(e.target.value);
  };

  useEffect(() => {
    getConfigApi()
      .then((res) => setConfig(res.data.data.results))
      .catch(() => alert("Cannot load profile configurations"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(defaulTip);
  return (
    <div>
      <Button onClick={handleOpen}>
        <AddIcon />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Add new Profle
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Profile Mode
                </InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  value={name}
                  label="Profile Mode"
                  onChange={(event) => handleChange(event, "name")}
                >
                  {config?.map((con) => (
                    <MenuItem value={con.name} onChange={formik.handleChange}>
                      {con.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="custom_payments"
                    value={formik.values.custom_payments}
                  />
                }
                label="Enable Other $ Amount"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="include_pricing_details"
                    value={formik.values.include_pricing_details}
                  />
                }
                label="Enable Price/Amount Details "
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="enable_tip"
                    value={formik.values.enable_tip}
                  />
                }
                label="Enable Tips"
              />
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
            <div style={{ display: "flex" }}>
              <TextField
                id="outlined-basic"
                label="Tip Button #1 (%)"
                variant="outlined"
                type="number"
                onChange={(e) => handleTipChange(e, "1")}
                value={tip1}
              />
              <TextField
                id="outlined-basic"
                label="Tip Button #2 (%)"
                variant="outlined"
                type="number"
                onChange={(e) => handleTipChange(e, "2")}
                value={tip2}
              />
              <TextField
                id="outlined-basic"
                label="Tip Button #3 (%)"
                variant="outlined"
                type="number"
                onChange={(e) => handleTipChange(e, "3")}
                value={tip3}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Default Tip
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={defaulTip}
                  label="Default Tip"
                  onChange={(event) => handleChange(event, "defaultTip")}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="TP1">Tip Button #1</MenuItem>
                  <MenuItem value="TP2">Tip Button #2</MenuItem>
                  <MenuItem value="TP3">Tip Button #3</MenuItem>
                </Select>
              </FormControl>
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="prompt_for_receipt"
                    value={formik.values.prompt_for_receipt}
                  />
                }
                label="Prompt for receipt"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="ask_customer_name"
                    value={formik.values.ask_customer_name}
                  />
                }
                label="Ask for customer name?"
              />
            </div>
            <h3>CLUB MEMBER PAYMENTS</h3>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="pay_by_account_number"
                    value={formik.values.pay_by_account_number}
                  />
                }
                label="Pay by account number"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="require_first_name"
                    value={formik.values.require_first_name}
                  />
                }
                label="Require first name"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="require_last_name"
                    value={formik.values.require_last_name}
                  />
                }
                label="Require last name"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="contained" type="submit">
                Submit
              </Button>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    name="is_deleted"
                    value={formik.values.is_deleted}
                  />
                }
                label="is_deleted"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Dbg upl log lvl:
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={dbg}
                  label="Dbg upl log lvl:"
                  onChange={(event) => handleChange(event, "dbg")}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={3}>DEBUG</MenuItem>
                  <MenuItem value={6}>ERROR</MenuItem>
                  <MenuItem value={4}>INFO</MenuItem>
                  <MenuItem value={2}>VERBOSE</MenuItem>
                  <MenuItem value={5}>WARN</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Dbg upl scheme:
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={dbgupl}
                  label="Dbg upl scheme:"
                  onChange={(event) => handleChange(event, "dbgupl")}
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
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default PaymentProfileModal;