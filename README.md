# @electron/hasher

> Ultra fast SHA generation for Azure files

## What is this?

As the final step of Electrons release process we download all the assets we're
about to publish, download the SHASUM file that was generated on CI, and then
validate the SHASUMs locally on the machine running the release.  This is
incredibly bottlenecked by your local I/O and network bandwidth.

Our release was typically delayed by >20 minutes just downloading and hashing
files. To make this part of the release quicker this lambda is used to calculate
the SHA of an arbitrary remote file.  In our case it's always an Azure Blob Storage
link which means that Azure Functions can compute that SHA insanely quickly as it effectively
has a direct connection to Blob Storage.

## Benchmarks

| | Locally with 1Gbs | Remote with Azure Functions |
|-|-------------------|--------------------|
| Single 7MB file | 3 seconds | 1.1 seconds |
| 20 x 7MB files | 41 seconds | 1.2 seconds |
| Complete Electron Release - 20GB | 16 minutes | 37 seconds |

## Usage

This module is deployed as an Azure Function to Electron's Azure account. Calling
it requires a function key.
