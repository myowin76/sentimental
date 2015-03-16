require 'test_helper'

class Admin::LicencesControllerTest < ActionController::TestCase
  setup do
    @admin_licence = admin_licences(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_licences)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_licence" do
    assert_difference('Admin::Licence.count') do
      post :create, admin_licence: { name: @admin_licence.name }
    end

    assert_redirected_to admin_licence_path(assigns(:admin_licence))
  end

  test "should show admin_licence" do
    get :show, id: @admin_licence
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_licence
    assert_response :success
  end

  test "should update admin_licence" do
    patch :update, id: @admin_licence, admin_licence: { name: @admin_licence.name }
    assert_redirected_to admin_licence_path(assigns(:admin_licence))
  end

  test "should destroy admin_licence" do
    assert_difference('Admin::Licence.count', -1) do
      delete :destroy, id: @admin_licence
    end

    assert_redirected_to admin_licences_path
  end
end
