import { UseSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetGroupEvents } from "../../store/events";
import { useNavigate } from "react-router-dom";
