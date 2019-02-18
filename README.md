# dazaar-cli

## Usage

```sh
# run the help
dazaar
```

Latest version prints something similar to this:

```
dazaar command line tool

dazaar sell <local-hypercore-path>
  - Sell a Hypercore stored at the given path
    Will print a "Sales key" that a buyer should
    use to buy the data

dazaar buy <sales key> <local-hypercore-path>
  - Buy a Hypercore and store it at the given path

When providing payment for a Hypercore include the
following address in the payment so it can be validated:

  <your public key>
```

Note that all dazaar information will be saved in ./dazaar.

If you are testing a `buy` and `sell` command on the same
machine make sure to run it from two different folders
to avoid a lock file error.

## License

Apache 2.0
