import React, { useState, useEffect } from "react";
import groundImage from "../Image/groundImage.png";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

function Todo() {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sortOrder, setSortOrder] = useState(null); // 'priority' or 'date'
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  // Load tasks from local storage when component mounts
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      console.log("Stored tasks:", storedTasks);
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to local storage whenever tasks state changes
  useEffect(() => {
    console.log("Saving tasks:", tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const addTask = () => {
    if (task && date) {
      const newTasks = [...tasks, { task, date }];
      console.log("Adding new task:", { task, date });
      setTasks(newTasks);
      setTask("");
      setDate("");
    }
  };

  const sortTasksByDate = () => {
    const sortedTasks = [...tasks].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setTasks(sortedTasks);
    setSortOrder("date");
  };

  const sortTasksByPriority = () => {
    // Placeholder for priority sorting logic, using date for now
    sortTasksByDate();
    setSortOrder("priority");
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const editTask = (index) => {
    const taskToEdit = tasks[index];
    setTask(taskToEdit.task);
    setDate(taskToEdit.date);
    deleteTask(index);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = tasks.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${groundImage})` }}
    >
      <div className="flex items-center justify-center h-[90px] bg-black bg-opacity-50">
        <h1 className="text-white text-4xl font-extrabold">To-Do</h1>
      </div>
      <div className="flex">
        <div
          className="mt-[340px] pl-[150px] text-9xl cursor-pointer"
          onClick={prevPage}
        >
          <FaChevronLeft className="text-white" />
        </div>
        <div className="ml-[75px] mt-[81px] pt-5 w-[460px] h-[590px] text-black bg-slate-50 rounded-lg shadow-lg">
          <div className="flex">
            <div className="h-[100px] mx-auto w-[400px] rounded-xl flex">
              <div className="space-y-3">
                <input
                  type="text"
                  value={task}
                  onChange={handleTaskChange}
                  placeholder="What to do"
                  className="pl-5 bg-slate-200 h-[40px] w-[300px] rounded-lg placeholder-gray-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={date}
                  onChange={handleDateChange}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  placeholder="Select a deadline"
                  className="pl-5 bg-slate-200 h-[40px] w-[300px] rounded-lg placeholder-gray-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <CiCirclePlus
                  className="text-5xl mt-5 ml-[-10px] cursor-pointer"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={addTask}
                />
                {showTooltip && (
                  <div className="absolute top-[-10px] left-[15px] bg-gray-700 text-white text-xs rounded py-1 px-2">
                    Add Task
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-[370px] ml-[40px] mt-[20px]">
            <div className="ml-[15px] text-lg text-zinc-600 font-medium">
              Sort by
            </div>
            <div
              className="ml-[200px] cursor-pointer text-xl font-semibold hover:text-2xl"
              onClick={sortTasksByPriority}
            >
              Priority
            </div>
          </div>
          <div className="mt-10 ml-[40px] w-[370px] space-y-5">
            {currentTasks.map((task, index) => (
              <div
                key={index + startIndex} // Update key to be unique across pages
                className="flex justify-between items-center p-2 border-b border-gray-300"
              >
                <div>
                  <input
                    type="checkbox"
                    className="rounded-full"
                    style={{ width: "15px", height: "15px" }}
                  />
                </div>
                <div className="flex gap-6 ml-[5px] items-center">
                  <span className="w-[140px] text-teal-900 text-left">{task.task}</span>
                  <span className="">{formatDate(task.date)}</span>
                </div>
                <div className="flex gap-5">
                  <div onClick={() => editTask(index + startIndex)}>
                    <FiEdit />
                  </div>
                  <div onClick={() => deleteTask(index + startIndex)}>
                    <MdDeleteForever className="text-xl cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="mt-[340px] ml-[80px] text-9xl cursor-pointer"
          onClick={nextPage}
        >
          <FaChevronRight className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default Todo;
