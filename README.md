# Dark Crystal Secrets

![dark-crystal-logo.jpg](https://darkcrystal.pw/assets/images/darkcrystal-logo.jpg)

[Dark Crystal's](https://darkcrystal.pw) encryption wrapper around Shamir's Secret Shares implementation [`secrets.js-grempe`](https://github.com/grempe/secrets.js).

Using a semantic versioning system, this module also provides backward compatibility to Dark Crystal records out there in the wild. This is required as we incrementally update Dark Crystal's encryption schemes, exploring, experimenting and improving our implementation.

## API

#### darkCrystal.pack(secret, label)
The secret is bundled up with the label / name given to the secret and stringified as JSON

#### darkCrystal.unpack(secret, version)
The secret is separated from its label / name and returned as an object

#### darkCrystal.share(secret, numOfShards, quorum)
* Generates a MAC which is composed the first 32 characters (16 bytes) of a SHA256 hash of the original secret
* Concatenates it at the beginning of the secret
* Splits the secret into numOfShards, where quorum is the number required to reassemble
* Compresses the shards from hex into base64 for more efficient storage

#### darkCrystal.verify(shards, version)
* Decompresses the shards from base64 to hex
* Reassembles the secret
* Checksig
  * MAC generated from the newly returned secret match the MAC attached to the returned secret.
  * Returns `false` if fails to pass check

#### darkCrystal.combine(shards, version)
* Decompresses the shards from base64 to hex
* Reassembles the secret
* Checksig
  * MAC generated from the newly returned secret match the MAC attached to the returned secret.
  * Throws an error if it fails to pass the check
* Returns the JSON string secret

#### darkCrystal.validateShard(shard, version)
* Decompresses the shards from base64 to hex
* Extracts components of the shard
  * bits: [Number] The number of bits configured when the share was created.
  * id: [Number] The ID number associated with the share when created.
  * data: [String] A hex string of the actual share data.
