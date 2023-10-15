import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";
import // randomCreatedDate,
// randomTraderName,
// randomId,
// randomArrayItem,
"@mui/x-data-grid-generator";
import { useContext } from "react";
import MyContext from "../MyContext";
import { Link } from "react-router-dom";
import ConfirmDialog from "../ConfirmDialog";
import { CircularProgress, IconButton } from "@mui/material";

const ProgressIcon = () => {
    return <CircularProgress style={{ width: "15px", height: "15px" }} />;
};

function EditToolbar(props) {
    // const { setRows, setRowModesModel } = props;

    // const handleClick = () => {
    //     const id = randomId();
    //     setRows((oldRows) => [
    //         ...oldRows,
    //         { id, name: "", age: "", isNew: true },
    //     ]);
    //     setRowModesModel((oldModel) => ({
    //         ...oldModel,
    //         [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    //     }));
    // };

    // return (
    //     <GridToolbarContainer>
    //         <Button
    //             color="primary"
    //             startIcon={<AddIcon />}
    //             onClick={handleClick}
    //         >
    //             Add Product
    //         </Button>
    //     </GridToolbarContainer>
    // );
    return (
        <GridToolbarContainer>
            <Link to="/products/add">
                <Button color="primary" startIcon={<AddIcon />}>
                    Add Product
                </Button>
            </Link>
        </GridToolbarContainer>
    );
}

export default function Admin() {
    const { products, setProducts, categories, setShortMessage, a } =
        useContext(MyContext);
    // משמש להצגת שאלה האם למחוק
    const [showConfirm, setShowConfirm] = React.useState(false);
    // מוצר נוכחי למחיקה
    const [currentProduct, setCurrentProduct] = React.useState({});
    // מכיל את המוצרים שכרגע נשמרים בשרת
    const [productsSaving, setProductsSaving] = React.useState([]);

    // השורות שמכילות את המוצרים
    const [rows, setRows] = React.useState(products);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
        });
    };

    // בעת לחיצה על מחיקה - הצג שאלה האם למחוק והגדר את המוצר הנוכחי למחיקה
    const handleDeleteClick = (id) => () => {
        setCurrentProduct(rows.find((row) => row.id === id));
        setShowConfirm(true);
    };

    // בעת אישור מחיקה
    const handleConfirmDelete = (onEnd) => {
        // מחק מהשרת
        fetch(`/api/products/${currentProduct.id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then((res) =>
            res.json().then((res) => {
                // הסתר בחזרה את השאלה האם למחוק
                setShowConfirm(false);
                // מחק מהקליינט
                setProducts(
                    products.filter(
                        (product) => product.id !== currentProduct.id
                    )
                );
                // מחק מטבלת הנתונים
                setRows(rows.filter((row) => row.id !== currentProduct.id));
                onEnd(false);
                setShortMessage({
                    open: true,
                    message: "The product has been successfully deleted",
                    severity: "info",
                });
            })
        );
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    // שמירה לאחר עריכה
    const processRowUpdate = (updatedRow, originalRow) => {
        // עדכן שהמוצר כרגע בשמירה בשרת והצג ספינר
        setProductsSaving([...productsSaving, originalRow.id]);
        // עדכן בשרת
        fetch(`/api/products/${originalRow.id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRow),
        }).then((res) => {
            res.json().then((updatedProduct) => {
                // עדכן בקליינט
                setProducts(
                    products.map((product) => {
                        console.log(
                            `${product.id}: ${product.id === originalRow.id}`
                        );
                        return product.id === originalRow.id
                            ? updatedProduct
                            : product;
                    })
                );
                // עדכן שהמוצר כבר לא בשמירה ובטל הצגה של ספינר
                setProductsSaving(
                    productsSaving.filter((id) => id !== originalRow.id)
                );
            });
            // הצג הודעת הצלחה
            setShortMessage({
                open: true,
                message: "The changes have been saved",
                severity: "success",
            });
        });
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: "title",
            headerName: "Title",
            editable: true,
            align: "left",
            headerAlign: "left",
            width: 200,
        },
        {
            field: "price",
            headerName: "Price",
            type: "number",
            editable: true,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "description",
            headerName: "Description",
            editable: true,
            align: "left",
            headerAlign: "left",
            width: 200,
        },
        {
            field: "category",
            headerName: "Category",
            editable: true,
            type: "singleSelect",
            valueOptions: categories,
            align: "left",
            headerAlign: "left",
            width: 175,
        },
        {
            field: "image",
            headerName: "Image",
            renderCell: (params) => (
                <img style={{ width: "25px" }} src={params.value} alt="" />
            ),
        },
        // { field: "name", headerName: "Name", width: 180, editable: true },
        // {
        //     field: "age",
        //     headerName: "Age",
        //     type: "number",
        //     width: 80,
        //     align: "left",
        //     headerAlign: "left",
        //     editable: true,
        // },
        // {
        //     field: "joinDate",
        //     headerName: "Join date",
        //     type: "date",
        //     width: 180,
        //     editable: true,
        // },
        // {
        //     field: "role",
        //     headerName: "Department",
        //     width: 220,
        //     editable: true,
        //     type: "singleSelect",
        //     valueOptions: ["Market", "Finance", "Development"],
        // },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode =
                    rowModesModel[id]?.mode === GridRowModes.Edit;

                const isSaving = productsSaving.includes(id);

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={isSaving ? <ProgressIcon /> : <EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: "100%",
                "& .actions": {
                    color: "text.secondary",
                },
                "& .textPrimary": {
                    color: "text.primary",
                },
            }}
        >
            <ConfirmDialog
                open={showConfirm}
                title="Are you sure you want to delete this product?"
                setOpen={setShowConfirm}
                onConfirm={handleConfirmDelete}
                currentProduct={currentProduct}
            >
                <h3>{currentProduct.title}</h3>
                <img
                    style={{ maxWidth: "180px", maxHeight: "180px" }}
                    src={currentProduct.image}
                    alt={currentProduct.title}
                />
                <p>{currentProduct.description}</p>
            </ConfirmDialog>
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
                autoHeight
                disableColumnMenu
                hideFooter
            />
        </Box>
    );
}
