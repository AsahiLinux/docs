The SoC has several onboard accelerator units, this is a useful list of the names and what they refer to.

* **AOP**: "hey siri" activation and "other sensor stuff"
* **PMP**: Power management processor probably, handles power functionality
* **DCP**: Displayport/Display
* **AVE**: "Audio/Visual Encoder?" Handles encoding
* **ANE**: "Apple Neural Engine?" Neural network execution acceleration
* **SEP**: Secure Enclave Processor. The M1's built-in HSM/TPM/etc device. Handles Touch ID and most crypto, as well as boot policy decisions. Harmless to Linux, but we can use its features if we want to. Contrast to AP.
* **AGX**: The internal name for Apple's GPU series.