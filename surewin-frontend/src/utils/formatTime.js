import { format, formatDistanceToNow } from "date-fns";

// ----------------------------------------------------------------------

export function fMonthandYear(date) {
  return format(new Date(date), "LLLL yyyy");
}
export function fDate(date) {
  return format(new Date(date), "EE, MMMM, dd yyyy");
}
export function fDateWord(date) {
  return format(new Date(date), "MMMM, dd yyyy");
}
export function fDateNumber(date) {
  return format(new Date(date), "dd/MM/yyyy");
}

export function fDateTime(date) {
  return format(new Date(date), "dd MMM yyyy HH:mm");
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), "dd/MM/yyyy p");
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
