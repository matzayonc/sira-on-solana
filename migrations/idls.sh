#!/bin/bash
cd "$(dirname "$0")"

rm ../app/src/utils/IDL/sira_on_solana.json
rm ../app/src/utils/IDL/types/sira_on_solana.ts

cp ../target/idl/sira_on_solana.json ../app/src/utils/IDL/sira_on_solana.json
cp ../target/types/sira_on_solana.ts ../app/src/utils/IDL/types/sira_on_solana.ts
