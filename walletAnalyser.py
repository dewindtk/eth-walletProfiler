import os
import json
wallets = {}


print("Please input the Wallet to be analysed: ")
addy = input()
print("Please name the Wallet you have just entered: ")
name = input()
wallets[addy] = name

print("Saving wallet data in wallets.json: ", wallets)
with open('./wallets.json', 'w') as file:
    json.dump(wallets, file)
print("Creating folder for", name)
os.mkdir("WALLET_"+name)
# Change the way js scripts are run
print("testing script...")


#AWAIT
os.system('cmd /c "node fetschTxs.js"')
