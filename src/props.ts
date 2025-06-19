import { addUiToH1PickAProp, addUiToPropsLines } from './props-mb';
import { isMb, isTraverse } from "./check-domain";
import { suppressUpdates } from "./mutation-observer";
import { addUiToH2PickAProp } from './props-traverse';

export function getProps() {
  suppressUpdates(true);
  if (isMb()) {
    addUiToPropsLines();
    addUiToH1PickAProp();
  }

  if (isTraverse()) {
    addUiToH2PickAProp();
  }

  suppressUpdates(false);
}
