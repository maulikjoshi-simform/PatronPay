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
import EditModal from "../modals/EditModal";
import "../../App.css";
import ReactExport from "react-data-export";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import CashlessTrans from "../modals/CashlessTrans";
import DatePicker from "../date/DatePicker";
import { setDate } from "date-fns";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

let counter = 0;
// a little function to help us with reordering the result
// From react-sortable-hoc sample code
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function createData(name, calories, fat, carbs, protein) {
  counter += 1;
  return { id: counter, name, calories, fat, carbs, protein };
}

const styles = (theme) => ({
  root: {
    // width: "100%",
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: "auto",
  },
});
let searchedData = [];
class EnhancedTable extends React.Component {
  constructor(props, context) {
    super();

    this.state = {
      open: false,
      order: "asc",
      orderBy: "calories",
      selected: [],
      renderer: [],
      data: [
        createData("Cupcake", 305, 3.7, 67, 4.3),
        createData("Donut", 452, 25.0, 51, 4.9),
        createData("Eclair", 262, 16.0, 24, 6.0),
        createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
        createData("Gingerbread", 356, 16.0, 49, 3.9),
        createData("Honeycomb", 408, 3.2, 87, 6.5),
        createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
        createData("Jelly Bean", 375, 0.0, 94, 0.0),
        createData("KitKat", 518, 26.0, 65, 7.0),
        createData("Lollipop", 151, 0.2, 98, 0.0),
        createData("Marshmallow", 318, 0, 81, 2.0),
        createData("Nougat", 360, 19.0, 9, 37.0),
        createData("Oreo", 437, 18.0, 63, 4.0),
        createData("Bagel", 305, 3.7, 67, 4.3),
        createData("Egg", 452, 25.0, 51, 4.9),
        createData("Cronut", 262, 16.0, 24, 6.0),
        createData("Ice cream", 159, 6.0, 24, 4.0),
        createData("Creme de Cassis", 356, 16.0, 49, 3.9),
        createData("Creme Brulee", 408, 3.2, 87, 6.5),
        createData("Monkfruit", 237, 9.0, 37, 4.3),
        createData("Jelly", 375, 0.0, 94, 0.0),
        createData("Green Tea KitKat", 518, 26.0, 65, 7.0),
        createData("Popsicle", 151, 0.2, 98, 0.0),
        createData("Marshmallow", 318, 0, 81, 2.0),
        createData("Nougat", 360, 19.0, 9, 37.0),
        createData("Oreo", 437, 18.0, 63, 4.0),
        createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
        createData("Jelly Bean", 375, 0.0, 94, 0.0),
        createData("KitKat", 518, 26.0, 65, 7.0),
        createData("Lollipop", 151, 0.2, 98, 0.0),
        createData("Marshmallow", 318, 0, 81, 2.0),
        createData("Nougat", 360, 19.0, 9, 37.0),
        createData("Oreo", 437, 18.0, 63, 4.0),
        createData("Bagel", 305, 3.7, 67, 4.3),
        createData("Egg", 452, 25.0, 51, 4.9),
        createData("Cronut", 262, 16.0, 24, 6.0),
        createData("Ice cream", 159, 6.0, 24, 4.0),
        createData("Creme de Cassis", 356, 16.0, 49, 3.9),
        createData("Creme Brulee", 408, 3.2, 87, 6.5),
        createData("Monkfruit", 237, 9.0, 37, 4.3),
        createData("Jelly", 375, 0.0, 94, 0.0),
        createData("Green Tea KitKat", 518, 26.0, 65, 7.0),
        createData("Popsicle", 151, 0.2, 98, 0.0),
        createData("Marshmallow", 318, 0, 81, 2.0),
        createData("Nougat", 360, 19.0, 9, 37.0),
        createData("Oreo", 437, 18.0, 63, 4.0),
      ].sort((a, b) => (a.calories < b.calories ? -1 : 1)),
      datacopy: [],
      // id must be lowercase
      // width must be integer (for pixels)
      // TODO: rename width -> widthInPixels?
      // TODO: make columnData a prop
      header: [
        { label: "Id", key: "id" },
        { label: "Payment Url", key: "payment_url" },
      ],
      columnData: [
        {
          id: "id",
          numeric: true,
          disablePadding: true,
          label: "ID",
          width: 500,
        },
        {
          id: "payment_url",
          numeric: false,
          disablePadding: false,
          label: "Payment Url",
          width: 200,
        },
        {
          id: "trs_type",
          numeric: false,
          disablePadding: false,
          label: "Transaction type",
          width: 200,
        },
      ],
      page: 0,
      rowsPerPage: 15,
    };
  }

  onDragEnd = (result) => {
    console.log(result);
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const columnData = reorder(
      this.state.columnData,
      result.source.index,
      result.destination.index
    );

    this.setState({
      columnData,
    });
    localStorage.setItem("Cols", JSON.stringify(this.state.columnData));
  };
  // Demo code
  handleWidthChange = (columnId, width) => {
    console.log("handle width change");
    this.setState((state) => {
      const currentColumns = state.columnData;
      const currentColumnIndex = currentColumns.findIndex((column) => {
        return column.id === columnId;
      });
      const columnToChange = currentColumns[currentColumnIndex];
      const changedColumn = { ...columnToChange, width };
      currentColumns.splice(currentColumnIndex, 1, changedColumn);
      // Return the unchanged columns concatenated with the new column
      const newState = {
        columnData: currentColumns,
      };
      return newState;
    });
  };

  handleArrayMove = (from, to, oldData) => {
    console.log("Reached here");
    // guessing this gets replaced by arrayMove method
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

  // material-ui code
  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.props.data.map((n) => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  // material-ui code
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
    this.setState({
      dataCopy: this.props.data,
    });
    this.setState({
      renderer: this.props.data,
    });
  }

  searchedFunc = (input) => {
    if (input.length > 0) {
      this.setState({
        renderer: input,
      });
    } else {
      this.setState({
        data: this.state.dataCopy,
      });
    }
  };

  exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "PatronPay Transaction";
    const headers = [["Id", "Payment Url"]];

    const data = this.props.data.map((elt) => [elt.id, elt.name]);

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("report.pdf");
  };

  setStartDate = (date) => {
    console.log(this.props.data);
    let createdDate = this.props.data.map((i) => {
      return {
        date: new Date(i.date_created).getDate(),
        id: i.id,
        url: i.payment_url,
        type: i.trs_type,
      };
    });

    // let days = createdDate.map(d => {
    //   return {date: d.date.getDate(), id: d.id, url: d.payment_url, type: d.txn_type}
    // })

    let filteredDates = createdDate.filter((fd) => {
      return fd.date < date.getDate();
    });
    console.log(filteredDates);
    this.setState({
      renderer: filteredDates,
    });
  };

  setEndDate = (date) => {
    let createdDate = this.props.data.map((i) => {
      return new Date(i.date_created);
    });
    let dates = createdDate.map((i) => new Date(i));
    let days = dates.map((d) => d.getDate());
    // console.log(days);
  };

  render() {
    const { classes, data } = this.props;
    const { order, orderBy, selected, rowsPerPage, page, renderer } =
      this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return (
      <Paper className="searchBox">
        <DatePicker
          setEndDate={(date) => this.setEndDate(date)}
          setStartDate={(date) => this.setStartDate(date)}
        />
        <EnhancedTableToolbar
          title="Transaction"
          numSelected={selected.length}
          items={this.props.data}
          searchedData={this.searchedFunc}
        />
        {/* TODO: Customize TablePagination per https://material-ui.com/demos/tables/#custom-table-pagination-action */}
        <div className={classes.tableWrapper}>
          {/* { id: "name",
          numeric: false,
          disablePadding: true,
          label: "Dessert (100g serving)",
          width: 500,} */}
          <div className="buttonGrp">
            <span style={{ marginRight: "1%" }}>
              <ExcelFile>
                <ExcelSheet data={this.props.data} name="Nutrition">
                  <ExcelColumn label="Id" value="id" />
                  <ExcelColumn label="Label" value="name" />
                </ExcelSheet>
              </ExcelFile>
            </span>
            <button
              style={{ marginRight: "1%" }}
              onClick={() => this.exportPDF()}
            >
              Generate pdf Report
            </button>
            <span style={{ marginRight: "1%" }}>
              <CSVLink data={this.props.data} headers={this.state.header}>
                <button>Download csv</button>
              </CSVLink>
            </span>
            <span style={{ marginRight: "2%" }}>
              <CashlessTrans name="Cashless Transaction" data={data} />
            </span>
          </div>
          <Table
            table-layout="fixed"
            className={classes.table}
            aria-labelledby="tableTitle"
          >
            <TableHead>
              <TableRow>
                <TablePagination
                  component="div"
                  count={this.props.data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page",
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page",
                  }}
                  rowsPerPageOptions={[15, 25, 50]}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableHead>
            <EnhancedTableHead
              handleReorderColumnData={this.onDragEnd}
              handleResizeColumn={this.handleWidthChange}
              columnData={this.state.columnData}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {renderer.length
                ? renderer
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((n) => {
                      const isSelected = this.isSelected(n.id);
                      return (
                        <TableRow
                          hover
                          onClick={(event) => this.handleClick(event, n.id)}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.id}
                          selected={isSelected}
                        >
                          <td style={{ width: "50em" }}>
                            {/* We need to nest the contenst of this row to parallel the
                             * use of Droppable in the header and ensure that headers and body line up.*/}
                            <Table style={{ display: "block" }}>
                              <TableBody>
                                <TableRow>
                                  <TableCell padding="checkbox">
                                    <Checkbox checked={isSelected} />
                                  </TableCell>
                                  {this.state.columnData.map((column) => {
                                    return column.numeric ? (
                                      <TableCell
                                        key={column.id}
                                        padding="none"
                                        width={`${column.width}px` || "100px"}
                                        // numeric
                                      >
                                        <div
                                          width={`${column.width}px` || "100px"}
                                          style={{
                                            // paddingRight: "40px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
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
                                          {n[column.id]}
                                        </div>
                                      </TableCell>
                                    );
                                  })}
                                  <div style={{ display: "flex" }}>
                                    {/* <CashlessTrans name="Cashless Transaction" data={data}/> */}
                                    <EditModal row={n}/>
                                  </div>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </td>
                        </TableRow>
                      );
                    })
                : data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((n) => {
                      const isSelected = this.isSelected(n.id);
                      return (
                        <TableRow
                          hover
                          onClick={(event) => this.handleClick(event, n.id)}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.id}
                          selected={isSelected}
                        >
                          <td style={{ width: "50em" }}>
                            {/* We need to nest the contenst of this row to parallel the
                             * use of Droppable in the header and ensure that headers and body line up.*/}
                            <Table style={{ display: "block" }}>
                              <TableBody>
                                <TableRow>
                                  <TableCell padding="checkbox">
                                    <Checkbox checked={isSelected} />
                                  </TableCell>
                                  {this.state.columnData.map((column) => {
                                    return column.numeric ? (
                                      <TableCell
                                        key={column.id}
                                        padding="none"
                                        width={`${column.width}px` || "100px"}
                                        // numeric
                                      >
                                        <div
                                          width={`${column.width}px` || "100px"}
                                          style={{
                                            // paddingRight: "40px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
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
                                          {n[column.id]}
                                        </div>
                                      </TableCell>
                                    );
                                  })}
                                  <div style={{ display: "flex" }}>
                                    {/* <CashlessTrans name="Cashless Transaction" data={data}/> */}
                                    <EditModal row={n}/>
                                  </div>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </td>
                        </TableRow>
                      );
                    })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
