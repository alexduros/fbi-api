/* eslint-disable no-console, no-debugger */
import { tap } from 'lodash/fp';
export default tap((data) => { console.log(data); debugger; });
