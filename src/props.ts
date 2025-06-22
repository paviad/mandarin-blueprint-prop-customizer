import { addUiToH1PickAProp, addUiToPropsLines } from "./props-mb";
import { isMb, isTraverse } from "./check-domain";
import { addUiToH2PickAProp, addUiToMovieReviewProps } from "./props-traverse";
import { MutationInfo } from './mutation-info';

export async function getProps(info: MutationInfo) {
  if (isMb()) {
    addUiToPropsLines();
    addUiToH1PickAProp();
  }

  if (isTraverse()) {
    addUiToH2PickAProp();
    addUiToMovieReviewProps();
  }
}
