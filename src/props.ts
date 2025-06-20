import { addUiToH1PickAProp, addUiToPropsLines } from "./props-mb";
import { isMb, isTraverse } from "./check-domain";
import { suppressUpdates } from "./mutation-observer";
import { addUiToH2PickAProp, addUiToMovieReviewProps } from "./props-traverse";

export async function getProps() {
  suppressUpdates(true);
  if (isMb()) {
    addUiToPropsLines();
    addUiToH1PickAProp();
  }

  if (isTraverse()) {
    addUiToH2PickAProp();
    addUiToMovieReviewProps();
  }

  suppressUpdates(false);
}
