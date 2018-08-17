class AccountsController < ApiController
  SLACK_WEB_API_BASE_URL = 'https://slack.com'
  def index
    @accounts = Account.all
      .map do |account|
        conn = Faraday::Connection.new(:url => SLACK_WEB_API_BASE_URL) do |builder|
          builder.use Faraday::Request::UrlEncoded
          builder.use Faraday::Response::Logger
          builder.use Faraday::Adapter::NetHttp
        end

        response = conn.get('/api/users.profile.get', {
          :token => ENV['SLACK_AUTH_TOKEN'],
          :user => account.slack_user_id_string,
        })
        user = JSON.parse response.body
        user['profile'].merge({
          slack_user_id_string: account.slack_user_id_string,
          ethereum_address: account.ethereum_address,
        })
      end

    render json: @accounts.to_json
  end

  # GET /accounts/:id
  def show
    @account = Account.find(params[:slack_user_id_string])
    render json: @account.to_json()
  end
end
