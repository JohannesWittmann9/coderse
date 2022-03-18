/* eslint-env browser */

import { updateEmail, updateUsername } from "../../api/User/updateUser.js";
import { getUser } from "../../api/User/getUser.js";
import { Observable, Event } from "../../utils/Observable.js";
import Config from "../../utils/Config.js";

class AccountManager extends Observable {

    constructor(){
        super();
    }

    async onAccountSubmit(username, email, password){
        let currentUser = await this.getUser(),
            currentEmail = currentUser.email;

        // For the case only the username should be changed
        if (currentEmail === email) {
            let errorCode;
            // We still have to check for the password to be correct
            await updateEmail(email, password).catch(error => errorCode = error.code);
            if(!Config.PW_ERRORCODES.includes(errorCode.toString())){
                updateUsername(username).then((res) => {
                    this.notifyAll(new Event("update-success", res));
                }, error => {
                    this.notifyAll(new Event("update-error", error));
                });  
            }
            else{
                this.notifyAll(new Event("update-error", "error"));
            }   
            return;
        }

        // If the email has changed, both values are tried to be updated
        // For the Username, it is not important to be changed, so if the email is valid
        // -> Username is changed, or not if it is still the same -> update success either way
        updateEmail(email, password).then(() => {
            updateUsername(username).then((res) => {
                this.notifyAll(new Event("update-success", res));
            }, error => {
                this.notifyAll(new Event("update-error", error));
            });
        }, error => {
            this.notifyAll(new Event("update-error", error));
        });
    }

    async getUser(){
        return await getUser();
    }
}

export default AccountManager;