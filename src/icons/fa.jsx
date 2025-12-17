import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShirt,
  faSocks,
  faShoePrints,
  faMitten,
  faHouse,
  faPlus,
  faFire,
  faMagnifyingGlass,
  faXmark,
  faArrowLeft,
  faPen,
  faUser,
  faCheck,
  faArrowRightFromBracket,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';

export const CATEGORY_ICON = {
  top: faShirt,
  bottom: faSocks,
  shoes: faShoePrints,
  outerwear: faMitten,
};

export const NAV_ICON = {
  home: faHouse,
  add: faPlus,
  wardrobe: faShirt,
};

export const COMMON_ICON = {
  fire: faFire,
  search: faMagnifyingGlass,
  close: faXmark,
  back: faArrowLeft,
  edit: faPen,
  user: faUser,
  check: faCheck,
  logout: faArrowRightFromBracket,
  shirt: faShirt,
  camera: faCamera,
};

export function FAIcon({ icon, className, ...props }) {
  return <FontAwesomeIcon icon={icon} className={className} {...props} />;
}