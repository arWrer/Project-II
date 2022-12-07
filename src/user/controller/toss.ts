import axios from "axios"
import { Request, Response } from "express";
import User from "../../api/models/User";
import Payment from "../../api/models/Payment";
import { v4 } from "uuid"

export const SuccessGetAuthKey = (req: Request, res: Response) => {
    var options = {
        method: 'POST',
        url: `https://api.tosspayments.com/v1/billing/authorizations/${req.query.authKey}`,
        headers: {
            Authorization: 'Basic dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==',
            'Content-Type': 'application/json'
        },
        data: { customerKey: req.query.customerKey }
    };

    axios.request(options).then(function (response) {
        const currentUserId = req.session.user.id

        const billingKey = response.data.billingKey
        const card = response.data.card

        Payment.create({
            id: v4(),
            user_id: currentUserId,
            toss_billing_key: billingKey,
            card_company: card.company,
            card_type: card.cardType,
            card_number: card.number,
            card_owner_type: card.ownerType,
        })

        res.send(response.data)
    }).catch(function (error) {
        res.send("카드 등록에 실패했습니다.")
    });
}

export const FailGetgAuthKey = (req: Request, res: Response) => {
    res.send("카드 등록에 실패했습니다.")
}