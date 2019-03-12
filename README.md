# Dark Crystal Secrets

[Dark Crystal's](https://darkcrystal.pw) encryption wrapper around Shamir's Secret Shares implementation [`secrets.js-grempe`](https://github.com/grempe/secrets.js).

Using a semantic versioning system, this module also provides backward compatibility to Dark Crystal records out there in the wild. This is required as we incrementally update Dark Crystal's encryption schemes, exploring, experimenting and improving our implementation.

<p align="center">
  <img src="https://darkcrystal.pw/assets/images/darkcrystal-logo.jpg" width="500" alt="dark-crystal-secrets">
</p>

## Example

```js
const { pack, unpack. share, verify, combine } = require('dark-crystal-secretes')

const labelledSecret = pack('burried under my tree fort', 'treasure chest 1')
const shares = share(labelledSecret, 5, 3) // split into 5 parts, quorum 3

shares.forEach(share => console.log(validateShard(share, '2.0.0'))

const validity = verify(share.slice(0,3), '2.0.0')
console.log(validity)

const recoveredLabelledSecret = combine(share.slice(0,3), '2.0.0')
const { secret, label } = unpack(recoveredLabelledSecret, '2.0.0')
```

## API

#### `pack(secret, label)`
The `secret` is bundled up with the `label` given to the secret and stringified as `JSON`

#### `unpack(secret, version)`
The `secret` is separated from the `label` and returned as an object

#### `share(secret, numOfShards, quorum)`
* Generates a `MAC` which is composed the first 32 characters (16 bytes) of a `SHA256` hash of the `secret`
* Concatenates it at the beginning of the `secret`
* Splits the secret into `numOfShards`, where `quorum` is the number required to reassemble
* Compresses the `shards` from `hex` into `base64` for more efficient storage

#### `verify(shards, version)`
* Decompresses the `shards` from `base64` to `hex`
* Reassembles the secret
* Checksig
  * `MAC` generated from the newly returned secret match the `MAC` attached to the returned secret.
  * Returns `false` if fails to pass check

#### `combine(shards, version)`
* Decompresses the shards from base64 to hex
* Reassembles the secret
* Checksig
  * `MAC` generated from the newly returned secret match the `MAC` attached to the returned secret.
  * Throws an error if it fails to pass the check
* Returns the `JSON` string secret

#### `validateShard(shard, version)`
* Decompresses the shards from base64 to hex
* Extracts components of the shard
  * `bits`: [Number] The number of bits configured when the share was created.
  * `id`: [Number] The ID number associated with the share when created.
  * `data`: [String] A hex string of the actual share data.
