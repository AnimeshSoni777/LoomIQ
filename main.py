from fastapi import FastAPI

app = FastAPI(title="WFX ERP Backend")


@app.get("/")
def read_root():
    return {"message": "ERP Backend Live"}