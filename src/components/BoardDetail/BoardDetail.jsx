import React, { useEffect, useState, useRef } from "react";
import Column from "./Column/Column";
import data2 from "./MockData";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./BoardDetail.css";
import AddColumnBtn from "./AddColumnInput/AddColumnInput";
import NavBar from "../HomePage/Navbar/NavBar";
import { Alert, CircularProgress, Snackbar, Stack } from "@mui/material";
import SideBar from "../HomePage/SideBar/SideBar";
import ScrollContainer from "react-indiana-drag-scroll";
import { useParams } from "react-router";
import BoardService from "../../services/board.service";
import useBoard from "../../store/useBoard";
import useColumn from "../../store/useColumn";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import { Button, Col, Input, Modal, Row, Select } from "antd";
import Avatar from "@mui/material/Avatar";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined.js";
import SearchUser from "../WorkSpaceSettings/SearchUser/SearchUser.jsx";
import ReplyIcon from "@mui/icons-material/Reply";
import { Navigate } from "react-router-dom";
const BoardDetail = () => {
  const { board, setBoard } = useBoard();
  const { column, setColumn } = useColumn();
  const boardId = useParams().id;
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [roll, setRoll] = useState("member");
  const [message, setMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [textLength, setTextLength] = useState(
    board && board.title ? board.title.length : "fit-content"
  );
  const [displayIcon, setDisplayIcon] = useState(false);
  const [title, setTitle] = useState();

  const boardRef = useRef(board);
  const columnRef = useRef(column);
  const [open, setOpen] = React.useState(false);
  const [openErr, setOpenErr] = React.useState(false);

  useEffect(() => {
    boardRef.current = board;
    columnRef.current = column;
  }, [board, column]);

  useEffect(() => {
    BoardService.getBoardDetail(boardId)
      .then((res) => {
        setBoard(res.data.board);
        setColumn(res.data.board.columns);
        setLoading(true);
        setTitle(res.data.board.title);
        setTextLength(res.data.board.title.length + 2);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [boardId]);

  const boardTitle = board.title;

  const handleChange = (e) => {
    setTextLength(e.target.value.length + 1);
    setTitle(e.target.value);
  };

  const handleTitleChange = () => {
    const data = {
      boardId: boardId,
      title: title,
    };
    BoardService.updateBoardTitle(data)
      .then((res) => {
        setBoard(res.data.board);
        setColumn(res.data.board.columns);
      })
      .catch((err) => console.log(err));
    setDisplayIcon(false);
  };

  const backgroundStyle = (board) => ({
    backgroundImage: board
      ? `url("../../../${board.backgroundImage}")`
      : "none",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  });

  const handleDragEnd = (res) => {
    const startingIndex = res.source.index;
    const startingCol = res.source.droppableId;
    const typeOfItem = res.type;
    const endingIndex = res.destination
      ? res.destination.index
      : board.columns.length;
    const endingCol = res.destination ? res.destination.droppableId : "root";
    setLoading(false);

    if (typeOfItem === "column") {
      const boardColData = [...board.columns];
      const [removedCol] = boardColData.splice(startingIndex, 1);
      boardColData.splice(endingIndex, 0, removedCol);
      setColumn(boardColData);
      const dataToBe = [...boardColData.map((item) => item._id)];
      const dataToSend = {
        board: boardRef.current._id,
        array: dataToBe,
      };
      BoardService.updateDragDrop(dataToSend)
        .then((res) => {
          setBoard(res.data.board);
          setColumn(res.data.board.columns);
        })
        .catch((err) => {
          console.log(err);
        });
      setLoading(true);
    } else if (typeOfItem === "task") {
      const boardColData = [...board.columns];
      const startedColIndex = boardColData.findIndex(
        (item) => item._id === startingCol
      );
      const endedColIndex = boardColData.findIndex(
        (item) => item._id === endingCol
      );

      const [removedTask] = boardColData[startedColIndex].tasks.splice(
        startingIndex,
        1
      );

      if (boardColData[endedColIndex].tasks.length === 0) {
        boardColData[endedColIndex].tasks.push(removedTask);
      } else {
        boardColData[endedColIndex].tasks.splice(endingIndex, 0, removedTask);
      }

      const dataToBE = {
        removedItemId: removedTask._id,
        startingColId: boardColData[startedColIndex]._id,
        endingColId: boardColData[endedColIndex]._id,
        startedIndex: startingIndex,
        endedIndex: endingIndex,
        boardId: boardId,
      };
      setColumn(boardColData);
      BoardService.updateDragDropTask(dataToBE)
        .then((res) => {
          setBoard(res.data.board);
          setColumn(res.data.board.columns);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        fontSize: "15px",
      },
      children:
        name.split(" ")[0] && name.split(" ")[1]
          ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
          : `${name.toUpperCase().substring(0, 2)}`,
    };
  }
  const handleErrClick = () => {
    setOpenErr(true);
  };
  const handleClick = () => {
    setOpen(true);
  };
  function handlerAddUser() {
    let dataAdd = {
      userId: userId,
      boardId: boardId,
      roll: roll,
    };
    BoardService.addUserToBoard(dataAdd)
      .then((res) => {
        if (res.data.message) {
          setBoard(res.data.board);
          setMessage(res.data.message);
          handleClick();
        } else if (res.data.error) {
          setErrMessage(res.data.error);
          handleErrClick();
        }
      })
      .catch((err) => console.log(err));
  }

  function choseRollUser(value) {
    setRoll(value);
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setOpenErr(false);
  };

  function changeRoleUser(value, idUser) {
    let dataChange = {
      boardId: boardId,
      role: value,
      idUser: idUser,
      currentUserId: JSON.parse(localStorage.getItem("user"))._id,
    };
    BoardService.changeRoleUser(dataChange)
      .then((res) => {
        if (res.data.message) {
          setBoard(res.data.board);
          setMessage(res.data.message);
          handleClick();
        } else if (res.data.error) {
          setErrMessage(res.data.error);
          handleErrClick();
        }
      })
      .catch((err) => console.log(err));
  }
  let isIdUser = false;
  let isAdmin = false;
  let currentUserId = JSON.parse(localStorage.getItem("user"))._id.toString();
  if (board && board.users) {
    isIdUser = board.users.some(
      (user) => user.idUser._id && user.idUser._id.toString() === currentUserId
    );
  }
  if (board && board.users) {
    isAdmin = board.users.some(
      (user) =>
        user.idUser._id &&
        user.idUser._id.toString() === currentUserId &&
        user.role === "admin"
    );
  }

  const isPrivateBoard = board.visibility === "private";
  if (!isIdUser && isPrivateBoard) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Snackbar open={openErr} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {errMessage}
        </Alert>
      </Snackbar>
      <NavBar />
      <Stack className="main-board-container" style={backgroundStyle(board)}>
        <SideBar />
        <ScrollContainer
          vertical={false}
          ignoreElements="p, button, input, section, Draggable"
          className="scroll-container"
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            style={{
              position: "sticky",
              top: 0,
              left: 0,
              paddingRight: "20px",
            }}
            justifyContent={"space-between"}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                maxWidth: "70vw",
              }}
            >
              <input
                type="text"
                value={title}
                style={{ width: `${textLength + 1}ch` }}
                className="board-title-input"
                onChange={(e) => handleChange(e)}
                onClick={() => setDisplayIcon(true)}
              />
              {displayIcon ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <CheckOutlinedIcon onClick={() => handleTitleChange()} />
                  <ClearOutlinedIcon
                    onClick={() => {
                      setDisplayIcon(false);
                      setTitle(board.title);
                    }}
                  />
                </div>
              ) : null}
            </div>
            <Button
              onClick={showModal}
              style={{
                color: "white",
                marginLeft: "10px",
              }}
              type="primary"
            >
              <ReplyIcon style={{ fontSize: "15px", margin: "auto" }} /> Share
            </Button>
          </Stack>
          <Stack direction={"column"} height={"100%"}>
            {/* <Stack direction={"row"} alignItems={"center"}>
              <input
                type="text"
                value={title}
                style={{ width: `${textLength + 1}ch` }}
                className="board-title-input"
                onChange={(e) => handleChange(e)}
                onClick={() => setDisplayIcon(true)}
              />
              {displayIcon ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <CheckOutlinedIcon onClick={() => handleTitleChange()} />
                  <ClearOutlinedIcon
                    onClick={() => {
                      setDisplayIcon(false);
                      setTitle(board.title);
                    }}
                  />
                </div>
              ) : null}
              <Button
                onClick={showModal}
                style={{
                  color: "white",
                  marginLeft: "10px",
                }}
                type="primary"
              >
                <ReplyIcon style={{ fontSize: "15px", margin: "auto" }} /> Share
              </Button>
            </Stack> */}
            <Modal
              open={isModalOpen}
              onCancel={handleCancel}
              footer={[]}
              width={700}
            >
              <h5 className="title-modal">Share Board</h5>
              <Row className="add-member-board-detail">
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  style={{ width: "100%" }}
                  justifyContent={"space-between"}
                >
                  <Col span={14} style={{ flexGrow: 1 }} className="col-modal">
                    <SearchUser
                      action="addToBoard"
                      userId={userId}
                      setUserId={setUserId}
                    />
                  </Col>
                  <Col
                    span={6}
                    className="col-modal"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Select
                      style={{ marginLeft: "10px" }}
                      defaultValue="member"
                      onChange={(value) => choseRollUser(value)}
                      options={[
                        {
                          value: "admin",
                          label: "Admin",
                        },
                        {
                          value: "member",
                          label: "Member",
                        },
                      ]}
                    />
                    <Button
                      style={{ marginLeft: "10px" }}
                      type="primary"
                      onClick={() => handlerAddUser()}
                    >
                      Share
                    </Button>
                  </Col>
                </Stack>
              </Row>
              {board.users && board.users
                ? board.users.map((item, index) => (
                    <Row className="list-user" key={index + 1}>
                      <Col span={6} offset={0}>
                        <div className="avatar">
                          <Row>
                            <Avatar
                              {...stringAvatar(`${item.idUser.fullName}`)}
                              sx={{
                                width: 30,
                                height: 30,
                                margin: "auto 0 auto 0",
                                fontSize: "14px",
                              }}
                            />
                            <div style={{ paddingLeft: "12px" }}>
                              <p style={{ color: "white" }}>
                                {item.idUser && item.idUser.fullName}
                              </p>
                              <Stack
                                direction={"row"}
                                gap={1}
                                alignItems={"center"}
                              >
                                <p style={{ fontSize: "14px", color: "white" }}>
                                  @{item.idUser && item.idUser.userName}
                                </p>
                              </Stack>
                            </div>
                          </Row>
                        </div>
                      </Col>
                      <Col
                        span={4}
                        offset={12}
                        style={{
                          marginTop: "auto",
                          display: "flex",
                          gap: "10px",
                          flexDirection: "row",
                        }}
                      >
                        {isAdmin ? (
                          <Select
                            defaultValue={item.role || "member"}
                            style={{
                              width: 100,
                            }}
                            onChange={(value) =>
                              changeRoleUser(value, item.idUser._id)
                            }
                            options={[
                              {
                                value: "admin",
                                label: "admin",
                              },
                              {
                                value: "member",
                                label: "member",
                              },
                            ]}
                          />
                        ) : (
                          <Button>{item.role || "member"}</Button>
                        )}
                        {/* Tú thêm logic delete người dùng ở đây nhé!! */}
                        <Button
                          type="primary"
                          danger
                          onClick={() => handlerAddUser()}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  ))
                : null}
            </Modal>
            <DragDropContext onDragEnd={handleDragEnd} style={{ flexGrow: 1 }}>
              <Droppable
                droppableId="root"
                type="column"
                direction="horizontal"
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="board-container"
                  >
                    {column && column.length
                      ? column.map((item, index) => (
                          <Column
                            props={item}
                            key={item._id}
                            index={index}
                            data={{ column, setColumn }}
                            board={{ boardId, boardTitle }}
                          />
                        ))
                      : null}
                    {provided.placeholder}
                    <AddColumnBtn column={{ column, setColumn, boardId }} />
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Stack>
        </ScrollContainer>
      </Stack>
    </>
  );
};

export default BoardDetail;
