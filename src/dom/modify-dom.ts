import { addUiToH1PickAProp, addUiToPropsLines } from "./modify-dom-mb";
import { isMb, isTraverse } from "../util/check-domain";
import { addUiToH2PickAProp, addUiToMovieReviewProps } from "./modify-dom-traverse";
import { MutationInfo } from '../model/mutation-info';

export async function modifyDom(info: MutationInfo) {
  if (isMb()) {
    addUiToPropsLines();
    addUiToH1PickAProp();
  }

  if (isTraverse()) {
    addUiToH2PickAProp();
    addUiToMovieReviewProps();
  }
}
