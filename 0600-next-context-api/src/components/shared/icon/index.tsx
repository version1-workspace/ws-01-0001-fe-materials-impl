import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Bell,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Code2,
  Compass,
  FileText,
  Filter,
  GitCommitHorizontal,
  Grid2X2,
  Info,
  List,
  LogOut,
  MoreVertical,
  Pencil,
  Plus,
  ScanLine,
  Search,
  Trash2,
  Undo2,
  User,
  X,
  XCircle,
} from "lucide-react";
import styles from "./index.module.css";
import { classHelper } from "@/lib/cls";

const icons = {
  unknown: Code2,
  logout: LogOut,
  filter: Filter,
  folder: Grid2X2,
  shouldbe: Compass,
  arrowForward: ArrowRight,
  arrowBack: ArrowLeft,
  goal: ScanLine,
  close: X,
  closeCircle: XCircle,
  forward: ChevronRight,
  back: ChevronLeft,
  chevronDown: ChevronDown,
  up: ArrowUp,
  down: ArrowDown,
  caretDown: ChevronDown,
  person: User,
  search: Search,
  notification: Bell,
  info: Info,
  calendar: Calendar,
  order: ArrowUpDown,
  check: CheckCircle,
  checkOutline: Check,
  add: Plus,
  addCircle: CirclePlus,
  save: Check,
  undo: Undo2,
  complete: Check,
  edit: Pencil,
  archive: Archive,
  remove: Trash2,
  barChart: BarChart3,
  lineChart: BarChart3,
  milestone: GitCommitHorizontal,
  task: FileText,
  menu: MoreVertical,
  layout: List,
};

type IconType = typeof icons;

interface Props {
  name: keyof IconType;
  className?: string;
  interactive?: "pulse" | "hover" | "hoverDark";
  size?: number | string;
  color?: string;
  onClick?: () => void;
}

const Icon = ({
  name,
  size,
  color,
  interactive,
  className,
  onClick,
}: Props) => {
  const Component = icons[name];
  return (
    <div
      className={classHelper({
        [styles.container]: true,
        [styles.interactive]: !!interactive,
        [styles.interactivePulse]: interactive === "pulse",
        [styles.interactiveHover]: interactive === "hover",
        [styles.interactiveHoverDark]: interactive === "hoverDark",
      })}
      onClick={onClick}>
      {<Component className={className} size={size} color={color} />}
    </div>
  );
};

export default Icon;
