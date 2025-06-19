import { loadDatabase } from './database';
import { getProps } from './props';

window.addEventListener("load", async () => {
  await loadDatabase();
  await getProps();
});
