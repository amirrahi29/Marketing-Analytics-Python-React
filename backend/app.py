from pathlib import Path

import numpy as np
import pandas as pd

from flask import Flask, jsonify
from flask_cors import CORS


# ==========================================================
# APP
# ==========================================================

app = Flask(__name__)

CORS(app)

app.json.sort_keys = False


# ==========================================================
# LOAD CSV
# ==========================================================

ROOT = Path(__file__).resolve().parent

CSV_PATH = ROOT / "general_data.csv"

df = pd.read_csv(CSV_PATH)


# ==========================================================
# CLEAN DATA
# ==========================================================

df["event_ts"] = pd.to_datetime(
    df["event_ts"],
    errors="coerce"
)

df["event_name"] = (
    df["event_name"]
    .astype(str)
    .str.lower()
    .str.strip()
)

df["channel"] = (
    df["channel"]
    .astype(str)
    .str.lower()
    .str.strip()
)

df.columns = df.columns.str.strip()

if "revenue" in df.columns:
    df["revenue"] = pd.to_numeric(
        df["revenue"],
        errors="coerce"
    ).fillna(0)

if "campaign_start_date" in df.columns:
    df["campaign_start_date"] = pd.to_datetime(
        df["campaign_start_date"],
        format="%d-%m-%Y",
        errors="coerce"
    )

if "campaign_end_date" in df.columns:
    df["campaign_end_date"] = pd.to_datetime(
        df["campaign_end_date"],
        format="%d-%m-%Y",
        errors="coerce"
    )


# ==========================================================
# HELPERS
# ==========================================================

def safe_div(n, d):
    return n / d if d != 0 else 0


def normalize(df_input):

    filtered_df = df_input.copy()

    filtered_df["event_name"] = (
        filtered_df["event_name"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    filtered_df["channel"] = (
        filtered_df["channel"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    filtered_df["event_ts"] = pd.to_datetime(
        filtered_df["event_ts"],
        errors="coerce"
    )

    return filtered_df


# ==========================================================
# HOME
# ==========================================================

@app.get("/")
def home():

    return {
        "status": "running",
        "service": "Marketing Analytics Backend"
    }


# ==========================================================
# GENERAL SUMMARY
# ==========================================================

@app.route(
    "/api/copilot/journey/measurement/generalsummary",
    methods=["GET"]
)
def get_measurement_summary():

    filtered_df = normalize(df)

    email_df = filtered_df[
        filtered_df["channel"] == "email"
    ].copy()

    Email_sent = (
        email_df["event_name"] == "sent"
    ).sum()

    Email_delivered = (
        email_df["event_name"] == "delivered"
    ).sum()

    Email_opened = (
        email_df["event_name"] == "opened"
    ).sum()

    Email_clicked = (
        email_df["event_name"] == "clicked"
    ).sum()

    Email_unsubscribed = (
        email_df["event_name"] == "unsubscribed"
    ).sum()

    Email_bounced = (
        email_df["event_name"] == "bounced"
    ).sum()

    revenue = (
        email_df["revenue"]
        .fillna(0)
        .sum()
    )

    return jsonify({

        "Email_sent": int(Email_sent),

        "Email_delivered": int(Email_delivered),

        "Email_delivery_rate": round(
            safe_div(
                Email_delivered,
                Email_sent
            ) * 100,
            2
        ),

        "Email_opened": int(Email_opened),

        "Email_open_rate": round(
            safe_div(
                Email_opened,
                Email_delivered
            ) * 100,
            2
        ),

        "Email_clicked": int(Email_clicked),

        "Email_click_percentage": round(
            safe_div(
                Email_clicked,
                Email_delivered
            ) * 100,
            2
        ),

        "Email_unsubscribed": int(
            Email_unsubscribed
        ),

        "Email_Bounced": int(
            Email_bounced
        ),

        "revenue": round(
            float(revenue),
            2
        )
    })


# ==========================================================
# CHANNEL MIX
# ==========================================================

@app.route(
    "/api/copilot/journey/measurement/channelmix",
    methods=["GET"]
)
def get_channel_mix():

    filtered_df = df.copy()

    total = len(filtered_df)

    CHANNEL_KEYWORDS = {
        "Email": ["email"],
        "SMS": ["sms"],
        "Push Notifications": ["push"],
        "WhatsApp": ["whatsapp"]
    }

    result = {}

    for channel, keywords in CHANNEL_KEYWORDS.items():

        count = filtered_df["channel"].apply(
            lambda x: any(
                kw in str(x).lower()
                for kw in keywords
            )
        ).sum()

        percentage = round(
            ((count / total) * 100),
            2
        ) if total > 0 else 0

        result[channel] = f"{percentage:.2f}%"

    return jsonify(result)


# ==========================================================
# DELIVER FUNNEL
# ==========================================================

@app.route(
    "/api/copilot/journey/measurement/deliverfunnel",
    methods=["GET"]
)
def get_channel_metrics():

    filtered_df = df.copy()

    total = len(filtered_df)

    METRICS = {
        "sent": ["sent"],
        "delivered": ["delivered"],
        "opened": ["opened"],
        "clicked": ["clicked"],
        "bounced": ["bounced"]
    }

    result = {}

    for metric, keywords in METRICS.items():

        count = int(
            filtered_df["event_name"].apply(
                lambda x: any(
                    kw in str(x).lower()
                    for kw in keywords
                )
            ).sum()
        )

        result[metric] = {
            "count": count,
            "percentage": (
                f"{round((count / total * 100), 2)}%"
                if total > 0
                else "0%"
            )
        }

    result["revenue"] = round(
        filtered_df["revenue"]
        .fillna(0)
        .sum(),
        2
    )

    return jsonify(result)


# ==========================================================
# SUBMISSION RATE
# ==========================================================

@app.route(
    "/api/submission_rate",
    methods=["GET"]
)
def submission_rate():

    by_channel = df.groupby("channel").agg(
        delivered=(
            "event_name",
            lambda x: (x == "delivered").sum()
        ),

        submitted=(
            "event_name",
            lambda x: (x == "submission").sum()
        )
    ).reset_index()

    by_channel["submission_rate"] = (
        (
            by_channel["submitted"]
            /
            by_channel["delivered"]
        ) * 100
    ).replace(
        [float("inf"), -float("inf")],
        0
    ).fillna(0).round(2)

    by_country = df.groupby("country_code").agg(
        delivered=(
            "event_name",
            lambda x: (x == "delivered").sum()
        ),

        submitted=(
            "event_name",
            lambda x: (x == "submission").sum()
        )
    ).reset_index()

    by_country["submission_rate"] = (
        (
            by_country["submitted"]
            /
            by_country["delivered"]
        ) * 100
    ).replace(
        [float("inf"), -float("inf")],
        0
    ).fillna(0).round(2)

    return jsonify({
        "by_channel": by_channel.to_dict(
            orient="records"
        ),
        "by_country": by_country.to_dict(
            orient="records"
        )
    })


# ==========================================================
# GENERAL TREND
# ==========================================================

@app.route(
    "/api/copilot/journey/measurement/generaltrend",
    methods=["GET"]
)
def get_measurement_trend():

    filtered_df = normalize(df)

    email_df = filtered_df[
        filtered_df["channel"] == "email"
    ].copy()

    email_df["date"] = (
        email_df["event_ts"].dt.date
    )

    sent_df = email_df[
        email_df["event_name"] == "sent"
    ]

    delivered_df = email_df[
        email_df["event_name"] == "delivered"
    ]

    opened_df = email_df[
        email_df["event_name"] == "opened"
    ]

    clicked_df = email_df[
        email_df["event_name"] == "clicked"
    ]

    trend = pd.DataFrame({
        "date": email_df["date"].drop_duplicates()
    })

    trend["Email sent"] = trend["date"].map(
        sent_df["date"].value_counts()
    ).fillna(0).astype(int)

    trend["Email delivered"] = trend["date"].map(
        delivered_df["date"].value_counts()
    ).fillna(0).astype(int)

    trend["Email opened"] = trend["date"].map(
        opened_df["date"].value_counts()
    ).fillna(0).astype(int)

    trend["Email clicked"] = trend["date"].map(
        clicked_df["date"].value_counts()
    ).fillna(0).astype(int)

    revenue_df = email_df.groupby(
        "date"
    )["revenue"].sum()

    trend["Revenue"] = trend["date"].map(
        revenue_df
    ).fillna(0)

    trend = trend.sort_values("date")

    trend["date"] = pd.to_datetime(
        trend["date"]
    ).dt.strftime("%Y-%m-%d")

    trend = trend.rename(columns={
        "date": "Email sent date",
        "Revenue": "revenue"
    })

    return jsonify(
        trend.to_dict(orient="records")
    )


# ==========================================================
# DISTRIBUTION API
# ==========================================================

@app.route(
    "/api/copilot/journey/measurement/generaldistribution",
    methods=["GET"]
)
def get_measurement_distribution():

    filtered_df = normalize(df)

    email_df = filtered_df[
        filtered_df["channel"] == "email"
    ].copy()

    Email_clicked = (
        email_df["event_name"] == "clicked"
    ).sum()

    Email_opened = (
        email_df["event_name"] == "opened"
    ).sum()

    Email_unsubscribed = (
        email_df["event_name"] == "unsubscribed"
    ).sum()

    Email_bounced = (
        email_df["event_name"] == "bounced"
    ).sum()

    return jsonify([
        {
            "metric": "Email clicked",
            "value": int(Email_clicked)
        },
        {
            "metric": "Email opened",
            "value": int(Email_opened)
        },
        {
            "metric": "Email unsubscribed",
            "value": int(Email_unsubscribed)
        },
        {
            "metric": "Email bounced",
            "value": int(Email_bounced)
        }
    ])


# ==========================================================
# CAMPAIGN SUMMARY
# ==========================================================

@app.route(
    "/api/copilot/journey/measurement/generalcampaign",
    methods=["GET"]
)
def campaign_summary():

    result = df.groupby(
        ["campaign_id", "campaign_name"]
    ).agg(

        sent=(
            "event_name",
            lambda x: (
                (x == "sent")
                &
                (
                    df.loc[x.index, "channel"]
                    == "email"
                )
            ).sum()
        ),

        delivered=(
            "event_name",
            lambda x: (
                (x == "delivered")
                &
                (
                    df.loc[x.index, "channel"]
                    == "email"
                )
            ).sum()
        ),

        opened=(
            "event_name",
            lambda x: (
                (x == "opened")
                &
                (
                    df.loc[x.index, "channel"]
                    == "email"
                )
            ).sum()
        ),

        clicked=(
            "event_name",
            lambda x: (
                (x == "clicked")
                &
                (
                    df.loc[x.index, "channel"]
                    == "email"
                )
            ).sum()
        ),

        unsubscribed=(
            "event_name",
            lambda x: (
                (x == "unsubscribed")
                &
                (
                    df.loc[x.index, "channel"]
                    == "email"
                )
            ).sum()
        ),

        bounced=(
            "event_name",
            lambda x: (
                (x == "bounced")
                &
                (
                    df.loc[x.index, "channel"]
                    == "email"
                )
            ).sum()
        ),

        revenue=("revenue", "sum")

    ).reset_index()

    return jsonify({
        "total_campaigns": int(
            result.shape[0]
        ),
        "data": result.to_dict(
            orient="records"
        )
    })


# ==========================================================
# CAMPAIGN DETAILS
# ==========================================================

@app.route(
    "/api/copilot/journey/measurement/generalcampaign/<campaign_id>",
    methods=["GET"]
)
def get_campaign_kpis_by_name(campaign_id):

    filtered_df = normalize(df)

    filtered_df["campaign_id"] = (
        filtered_df["campaign_id"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    filtered_df = filtered_df[
        filtered_df["campaign_id"]
        == campaign_id.lower()
    ].copy()

    if filtered_df.empty:

        return jsonify({
            "error": f"Campaign '{campaign_id}' not found"
        }), 404

    email_df = filtered_df[
        filtered_df["channel"] == "email"
    ].copy()

    Email_sent = (
        email_df["event_name"] == "sent"
    ).sum()

    Email_delivered = (
        email_df["event_name"] == "delivered"
    ).sum()

    Email_opened = (
        email_df["event_name"] == "opened"
    ).sum()

    Email_clicked = (
        email_df["event_name"] == "clicked"
    ).sum()

    Email_unsubscribed = (
        email_df["event_name"] == "unsubscribed"
    ).sum()

    Email_bounced = (
        email_df["event_name"] == "bounced"
    ).sum()

    revenue = (
        email_df["revenue"]
        .fillna(0)
        .sum()
    )

    Open_Rate = safe_div(
        Email_opened,
        Email_delivered
    )

    CTR = safe_div(
        Email_clicked,
        Email_delivered
    )

    Unsubscribe_Rate = safe_div(
        Email_unsubscribed,
        Email_delivered
    )

    campaign_name = (
        filtered_df["campaign_name"]
        .iloc[0]
    )

    return jsonify([{

        "Campaign ID": campaign_id,

        "Campaign Name": campaign_name,

        "Emails Sent": int(Email_sent),

        "Emails Delivered": int(
            Email_delivered
        ),

        "Emails Opened": int(
            Email_opened
        ),

        "Emails Clicked": int(
            Email_clicked
        ),

        "Unsubscribed": int(
            Email_unsubscribed
        ),

        "Bounced": int(
            Email_bounced
        ),

        "Revenue": round(
            float(revenue),
            2
        ),

        "Open Rate": "{:.2f}%".format(
            Open_Rate * 100
        ),

        "CTR": "{:.2f}%".format(
            CTR * 100
        ),

        "Unsubscribe Rate": "{:.2f}%".format(
            Unsubscribe_Rate * 100
        )
    }])


# ==========================================================
# TOP CAMPAIGNS
# ==========================================================

@app.route(
    "/api/copilot/journey/measurement/topcampaigns",
    methods=["GET"]
)
def top_campaigns():

    result = df.groupby(
        ["campaign_id", "campaign_name"]
    ).agg(
        revenue=("revenue", "sum")
    ).reset_index()

    result = result.sort_values(
        "revenue",
        ascending=False
    ).head(10)

    return jsonify(
        result.to_dict(orient="records")
    )


# ==========================================================
# REVENUE TREND
# ==========================================================

@app.route(
    "/api/copilot/journey/measurement/revenuetrend",
    methods=["GET"]
)
def revenue_trend():

    trend = df.groupby(
        df["event_ts"].dt.date
    )["revenue"].sum().reset_index()

    trend.columns = [
        "date",
        "revenue"
    ]

    trend["date"] = pd.to_datetime(
        trend["date"]
    ).dt.strftime("%Y-%m-%d")

    return jsonify(
        trend.to_dict(orient="records")
    )


# ==========================================================
# COUNTRY ANALYTICS
# ==========================================================

@app.route(
    "/api/copilot/journey/measurement/countryanalytics",
    methods=["GET"]
)
def country_analytics():

    result = df.groupby(
        "country_code"
    ).agg(
        revenue=("revenue", "sum"),
        total=("event_name", "count")
    ).reset_index()

    return jsonify(
        result.to_dict(orient="records")
    )


# ==========================================================
# DEVICE ANALYTICS
# ==========================================================

@app.route(
    "/api/copilot/journey/measurement/deviceanalytics",
    methods=["GET"]
)
def device_analytics():

    result = df.groupby(
        "device"
    ).agg(
        revenue=("revenue", "sum"),
        total=("event_name", "count")
    ).reset_index()

    return jsonify(
        result.to_dict(orient="records")
    )


# ==========================================================
# RUN
# ==========================================================

if __name__ == "__main__":

    print(
        "Marketing Analytics Backend Running..."
    )

    app.run(
        debug=True,
        port=5001
    )