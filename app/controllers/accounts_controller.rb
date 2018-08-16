class AccountsController < ApiController
  def index
    @accounts = Account.select("slack_user_id, ethereum_address").all
    render json: @accounts.to_json
  end

  # GET /accounts/:id
  def show
    @account = Account.find(params[:slack_user_id])
    render json: @account.to_json()
  end
end
