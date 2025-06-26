import { addUiToH1PickAProp, addUiToPropsLines } from "./mb";
import { isMb, isTraverse } from "../util/check-domain";
import { MutationInfo } from "../model/mutation-info";
import { loadSettings } from "../util/settings-operations";
import { addUiToH2PickAProp, addUiToMovieReviewProps } from "./traverse";

export async function modifyDom(info: MutationInfo) {
  if (isMb()) {
    const settings = await loadSettings();
    const hideDefault = settings?.hideDefault || false;
    await addUiToPropsLines(hideDefault);
    await addUiToH1PickAProp();
  }

  if (isTraverse()) {
    await addUiToH2PickAProp();
    await addUiToMovieReviewProps();
  }
}
