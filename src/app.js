#!/usr/bin/env node

//import cute from 'cute-files';
import externalip from 'externalip';
import {exec} from 'child-process-promise';

externalip((err,ip) => {
    console.log(ip);
});
exec('cute-files -p 80');
