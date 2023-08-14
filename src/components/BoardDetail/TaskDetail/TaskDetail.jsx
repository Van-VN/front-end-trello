import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import "./TaskDetail.css";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import RollerShadesOutlinedIcon from "@mui/icons-material/RollerShadesOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import CopyAllOutlinedIcon from "@mui/icons-material/CopyAllOutlined";
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import TaskEditor from "./TaskEditor/TaskEditor";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  minWidth: "700px",
  bgcolor: "#1a1a1a",
  boxShadow: 24,
  border: "none",
  p: "20px",
  outline: "none",
  borderRadius: "4px",
};

const handleEditTask = () => {
  console.log("Bổ sung update task name!");
};

export default function TaskDetail({ props }) {
  const handleOpen = () => props.setOpenModal(true);
  const handleClose = () => props.setOpenModal(false);
  const [displayEditor, setDisplayEditor] = React.useState(false);
  const [taskName, setTaskName] = React.useState("");

  const openTaskEditor = () => {
    setDisplayEditor(true);
  };

  return (
    <div>
      <Modal
        open={props.openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* Header của task detail */}
          <Stack direction={"row"} gap={2} alignItems={"start"} mb={2}>
            <ListAltIcon style={{ color: "white" }} />
            <div style={{ flexGrow: 1 }}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <input
                  className="change-task-title"
                  type="text"
                  placeholder={props.props.item.content}
                  style={{ all: "unset" }}
                />
                <CreateIcon
                  style={{ color: "white" }}
                  onClick={() => handleEditTask()}
                />
              </Stack>
              <p style={{ fontSize: "14px" }}>
                in list{" "}
                <Link to={props.boardUrl} style={{ textDecoration: "auto" }}>
                  {props.props.board.boardTitle}
                </Link>
              </p>
            </div>
          </Stack>
          {/* Kết thúc Header của task detail */}
          <Stack direction={"row"} gap={2}>
            <Stack
              sx={{ flexGrow: 1 }}
              direction={"row"}
              gap={2}
              alignItems={"flex-start"}
            >
              <MenuIcon />
              <Stack style={{ flexGrow: 1 }} gap={1}>
                <Typography>Description</Typography>
                <input
                  style={{ display: displayEditor ? "none" : null }}
                  className="task-description-box"
                  type="text"
                  placeholder="Add a more detailed description…"
                  onClick={() => setDisplayEditor(true)}
                />
                <div style={{ display: displayEditor ? null : "none" }}>
                  <TaskEditor setDisplayEditor={setDisplayEditor} />
                </div>
              </Stack>
            </Stack>
            <Stack dirrection="column" gap={2}>
              <div className="right-col-detail">
                <p>Add to card</p>
                <button>
                  <div className="task-detail-func-btn">
                    <PersonOutlineOutlinedIcon style={{ fontSize: "14px" }} />{" "}
                    Members
                  </div>
                </button>
                <button>
                  <div className="task-detail-func-btn">
                    <LocalOfferOutlinedIcon style={{ fontSize: "14px" }} />{" "}
                    Labels
                  </div>
                </button>
                <button>
                  <div className="task-detail-func-btn">
                    <ChecklistOutlinedIcon style={{ fontSize: "14px" }} />{" "}
                    Checklist
                  </div>
                </button>
                <button>
                  <div className="task-detail-func-btn">
                    <AccessTimeOutlinedIcon style={{ fontSize: "14px" }} />{" "}
                    Dates
                  </div>
                </button>
                <button>
                  <div className="task-detail-func-btn">
                    <AttachmentOutlinedIcon style={{ fontSize: "14px" }} />{" "}
                    Attackment
                  </div>
                </button>
                <button>
                  <div className="task-detail-func-btn">
                    <RollerShadesOutlinedIcon style={{ fontSize: "14px" }} />{" "}
                    Cover
                  </div>
                </button>
                <button>
                  <div className="task-detail-func-btn">
                    <TuneOutlinedIcon style={{ fontSize: "14px" }} /> Custom
                    Fields
                  </div>
                </button>
              </div>
              <div className="right-col-detail">
                <p>Actions</p>
                <button>
                  <div className="task-detail-func-btn">
                    <DriveFileMoveOutlinedIcon style={{ fontSize: "14px" }} />{" "}
                    Move
                  </div>
                </button>
                <button>
                  <div className="task-detail-func-btn">
                    <CopyAllOutlinedIcon style={{ fontSize: "14px" }} /> Copy
                  </div>
                </button>
                <button>
                  <div className="task-detail-func-btn">
                    <BrandingWatermarkOutlinedIcon
                      style={{ fontSize: "14px" }}
                    />{" "}
                    Make Template
                  </div>
                </button>
                <button>
                  <div className="task-detail-func-btn">
                    <AutoDeleteOutlinedIcon style={{ fontSize: "14px" }} />{" "}
                    Archive
                  </div>
                </button>
                <button>
                  <div className="task-detail-func-btn">
                    <ShareOutlinedIcon style={{ fontSize: "14px" }} /> Share
                  </div>
                </button>
              </div>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
